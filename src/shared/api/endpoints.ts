export const ENDPOINTS = {
  organizations: '/organizations/',
  organization: (id: number) => `/organizations/${id}`,
  organizationsSearch: '/organizations/search',
  organizationsByBuilding: (buildingId: number) =>
      `/organizations/by-building/${buildingId}`,
  organizationsByActivity: (activityId: number) =>
      `/organizations/by-activity/${activityId}`,
  organizationsByActivitySearch: '/organizations/by-activity/search',
  buildingsSearchArea: '/buildings/search_area',
  activities: '/activities/',
} as const;