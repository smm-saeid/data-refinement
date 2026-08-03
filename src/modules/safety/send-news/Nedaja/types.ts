export type AwarenessClass = {
    classDate: string;
    unitName: string;
    subject: string;
    participants: string;
    instructor: string;
}

export type NewsItem = {
    id: string;
    newsletterNo: number;
    reportDate: string;
    inspection: string;
    ceremony: string;
    incident: string;
    awarenessClass: AwarenessClass[];
    publicAid: string;
    importantEvent: string;
    archived: boolean;
}