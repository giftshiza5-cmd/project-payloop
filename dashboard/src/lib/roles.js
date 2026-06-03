export const roleRoutes = {
  member: "/member",
  treasurer: "/treasurer",
  groupAdmin: "/group-admin",
  superAdmin: "/super-admin",
};

export const roleOptions = [
  {
    id: "member",
    role: "Member",
    route: roleRoutes.member,
    description: "View personal savings, make contributions, request loans, check credit score, view transactions, and update profile.",
  },
  {
    id: "treasurer",
    role: "Treasurer",
    route: roleRoutes.treasurer,
    description: "View group finances, monitor contributions, track repayments, and generate financial reports.",
  },
  {
    id: "groupAdmin",
    role: "Group Admin",
    route: roleRoutes.groupAdmin,
    description: "Create groups, manage members, approve loans, send announcements, and view group analytics.",
  },
  {
    id: "superAdmin",
    role: "Super Admin",
    route: roleRoutes.superAdmin,
    description: "Manage all users, groups, administrators, audit logs, platform analytics, and system settings.",
  },
];

