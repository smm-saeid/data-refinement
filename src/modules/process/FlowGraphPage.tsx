import { useMemo, useCallback, useEffect, useRef } from "react";
import { useParams, useSearchParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import ReactFlow, {
  Background,
  addEdge,
  useNodesState,
  useEdgesState,
  type Connection,
  type Edge,
  type Node,
  type ReactFlowInstance,
} from "reactflow";
import "reactflow/dist/style.css";
import { CircularProgress, Box, Typography, Button, Stack } from "@mui/material";
import { useLegacyApi } from "@/hooks/useLegacyApi";

export default function FlowRuleGraphPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const flowName = searchParams.get("name");

  const legacyApi = useLegacyApi();
  const reactFlowInstance = useRef<ReactFlowInstance | null>(null);

  const serializedFlowSteps = `flow-rule-step/flow-rule/${id}`;

  const { data, isLoading } = useQuery({
    queryKey: ["flow-rule-steps", serializedFlowSteps],
    queryFn: () => legacyApi.get(serializedFlowSteps),
    enabled: !!id,
  });

  const steps = data?.data ?? [];

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);


  const buildInitialGraph = useCallback(() => {
    if (!id) return;

    const rootNode: Node = {
      id: `flow-${id}`,
      position: { x: 400, y: 0 },
      data: { label: flowName || "Start" },
      style: {
        backgroundColor: "#2e7d32",
        color: "#fff",
        padding: 10,
        borderRadius: 8,
        fontWeight: "bold",
      },
    };

    const stepNodes: Node[] = steps.map((step, index) => {
      const isEndNode = !step.nextSteps || step.nextSteps.length === 0;

      return {
        id: step.id,
        position: { x: 400, y: 150 + index * 120 },
        data: { label: step.roleName },
        style: {
          backgroundColor: isEndNode ? "#e200002d" : "#eeeeee",
          color: isEndNode ? "#000000ff" : "#000",
          padding: 10,
          borderRadius: 8,
        },
      };
    });

    const initialEdges: Edge[] = [];

    steps
      .filter((step) => !step.previousStepId)
      .forEach((step) => {
        initialEdges.push({
          id: `edge-root-${step.id}`,
          source: `flow-${id}`,
          target: step.id,
        });
      });

    steps.forEach((step) => {
      (step.nextSteps || []).forEach((next) => {
        const nextId = typeof next === "object" ? next.id : next;
        initialEdges.push({
          id: `edge-${step.id}-${nextId}`,
          source: step.id,
          target: nextId,
        });
      });
    });

    setNodes([rootNode, ...stepNodes]);
    setEdges(initialEdges);
  }, [id, flowName, steps, setNodes, setEdges]);

  useEffect(() => {
    buildInitialGraph();
  }, [buildInitialGraph]);


  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => addEdge(connection, eds));
    },
    [setEdges]
  );


  const handleSave = () => {
    const payload = {
      nodes: nodes.map((n) => ({
        id: n.id,
        position: n.position,
      })),
      edges: edges.map((e) => ({
        source: e.source,
        target: e.target,
      })),
    };

    console.log("SAVE GRAPH:", payload);


  };

  const handleReset = () => {
    buildInitialGraph();
    reactFlowInstance.current?.fitView();
  };

  const handleAutoLayout = () => {
    setNodes((nds) =>
      nds.map((node, index) => ({
        ...node,
        position: {
          x: 400,
          y: index * 130,
        },
      }))
    );
    reactFlowInstance.current?.fitView();
  };


  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100vw", height: "100vh", display: "flex", flexDirection: "column" }}>
      <Box p={2} borderBottom={1} borderColor="divider">
        <Typography variant="h6">Graph: {flowName}</Typography>
      </Box>

      {/* 🔧 CUSTOM TOOLBAR */}
      <Box p={1} borderBottom={1} borderColor="divider">
        <Stack direction="row" spacing={1}>
          <Button size="small" variant="contained" onClick={handleSave}>
            ذخیره
          </Button>
          <Button size="small" onClick={handleReset}>
            بازآوری
          </Button>

          <Button size="small" onClick={() => reactFlowInstance.current?.zoomIn()}>
            +
          </Button>
          <Button size="small" onClick={() => reactFlowInstance.current?.zoomOut()}>
            -
          </Button>
          <Button size="small" onClick={() => reactFlowInstance.current?.fitView()}>
            تمام صفحه
          </Button>
        </Stack>
      </Box>

      <Box flexGrow={1}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={(instance) => (reactFlowInstance.current = instance)}
          fitView
        >
          <Background />
        </ReactFlow>
      </Box>
    </Box>
  );
}
