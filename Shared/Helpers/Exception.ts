import AppInsights from '@coop/azure/lib/AppInsights';

export const LogException = async function (methodName: string, error: any) {
  AppInsights.trackException(`${methodName} - ${error}`);
};
