import React from 'react';
import { Route, Switch } from 'react-router-dom';
import ConnectedLogin from '../views/Login';
import ConnectedDashboard from '../views/Dashboard';
import ConnectedRequests from '../views/Requests';
import ConnectedGuestHouseDetails from '../views/Accommodation/FullGuestHouseDetails';
import RequireAuth from '../hoc/authHoc';
import ConnectedApprovals from '../views/Approvals';
import ConnectedRole from '../views/Role';
import ConnectedUserProfile from '../views/UserProfile';
import LayoutShell from '../hoc/Layout';
import ConnectedAccommodation from '../views/Accommodation';
import ConnectedCheckIn from '../views/CheckIn';
import ConnectedChecklist from '../views/Checklist';
import ConnectedRoleDetails from '../views/RoleDetails';


const Routes = () => (
  <Switch>
    <Route
      path="/"
      exact
      component={ConnectedLogin}
    />
    <Route
      path="/redirect/*"
      exact
      component={ConnectedLogin}
    />
    <Route>
      <LayoutShell>
        <Switch>
          <Route
            path="/dashboard"
            exact
            component={RequireAuth(ConnectedDashboard)}
          />
          <Route
            path="/requests/my-approvals"
            exact
            component={RequireAuth(ConnectedApprovals)}
          />
          <Route
            path="/requests"
            exact
            component={RequireAuth(ConnectedRequests)}
          />
          <Route
            path="/settings/roles"
            exact
            component={RequireAuth(ConnectedRole)}
          />
          <Route
            path="/requests/:requestId"
            exact
            component={RequireAuth(ConnectedRequests)}
          />
          <Route
            path="/settings/profile"
            exact
            component={RequireAuth(ConnectedUserProfile)}
          />
          <Route
            path="/requests/my-approvals/:requestId"
            exact
            component={RequireAuth(ConnectedApprovals)}
          />
          <Route
            path="/residence/manage"
            exact
            component={RequireAuth(ConnectedAccommodation)}
          />
          <Route
            path="/residence/manage/guest-houses/:guestHouseId"
            exact
            component={RequireAuth(ConnectedGuestHouseDetails)}
          />
          <Route
            path="/residence/checkin"
            exact
            component={RequireAuth(ConnectedCheckIn)}
          />
          <Route
            path="/checklists"
            exact
            component={RequireAuth(ConnectedChecklist)}
          />
          <Route
            path="/settings/roles/:roleId"
            exact
            component={RequireAuth(ConnectedRoleDetails)}
          />
        </Switch>
      </LayoutShell>
    </Route>
  </Switch>
);

export default Routes;
