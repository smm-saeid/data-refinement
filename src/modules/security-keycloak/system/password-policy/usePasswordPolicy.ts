// components/passwordPolicy/usePasswordPolicy.ts
import { useState } from 'react';
import { useNotification } from '../../NotificationContext';
import {
  useKeycloakApiQuery,
  useKeycloakApiMutation,
} from '../../../../hooks/useApiKeycloak';
import keycloakApis from '../../apis';
import type {
  PasswordPolicy,
  PasswordPolicyRequest,
  PasswordPolicyResponse,
} from '../../types';

export function usePasswordPolicy() {
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(false);

 
  const {
    data: response,
    isLoading: isFetching,
    error: fetchError,
    refetch: fetchPolicy,
  } = useKeycloakApiQuery<PasswordPolicyResponse, any>({
    url: keycloakApis.passwordPolicy.display,
    config: {
      data: null,
    },
  });


  const updateMutation = useKeycloakApiMutation<any, PasswordPolicyRequest>({
    url: keycloakApis.passwordPolicy.update,
    method: 'POST',
    onSuccess: () => {
      showNotification('سیاست رمز عبور با موفقیت ذخیره شد', 'success');
 
      fetchPolicy();
    },
    onError: error => {
      showNotification(
        error.response?.data?.message || 'خطا در ذخیره سیاست‌ها',
        'error'
      );
    },
  });

 
  const policyData = response?.data?.responseList?.[0];

  const savePolicy = async (values: PasswordPolicy) => {
    setLoading(true);
    try {
      const requestBody: PasswordPolicyRequest = {
        paginationModel: {},
        searchModel: values,
      };

      await updateMutation.mutateAsync(requestBody);
    } catch (error) {
      console.error('Error saving password policy:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    policyData,
    loading: loading || isFetching,
    error: fetchError,
    fetchPolicy,
    savePolicy,
    isSaving: updateMutation.isPending,
  };
}
