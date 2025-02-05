// import { CanActivate, ExecutionContext, mixin } from "@nestjs/common";
// import { Reflector } from "@nestjs/core";

// @Injectable()

// const
// class RoleGuard implements CanActivate {
//   constructor(private reflector: Reflector) {}

//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     const { user } = context.switchToHttp().getRequest();

//     // Skip permission check for Super Admins
//     if (user?.isSuperAdmin) return true;

//     // If the user doesn't have a role, deny access
//     if (!user?.roleId) {
//       return false;
//     }

//     // Get the resource and actions from the permission decorator
//     const permissions = this.reflector.getAllAndOverride<IPermissionsDecoratorOptions[]>("permissions", [context.getHandler(), context.getClass()]);

//     for (const permission of permissions) {
//       const { resource, actions } = permission;

//     //   const userWithPermissions = await this.prismaService.user.findUnique({
//     //     where: {
//     //       id: user.id,
//     //     },
//     //     select: {
//     //       role: {
//     //         select: {
//     //           id: true,
//     //           name: true,
//     //           permissions: {
//     //             select: {
//     //               id: true,
//     //               actions: true,
//     //               resource: true,
//     //             },
//     //           },
//     //         },
//     //       },
//     //     },
//     //   });

//       // Check if the user has the permission for the specified resource
//       const matchingPermission = userWithPermissions.role.permissions.find((permission) => permission.resource === resource);

//       if (!matchingPermission) {
//         // If no permission for the resource is found, deny access
//         return false;
//       }

//       // Extract the actions that the user has for this resource
//       const userActions = matchingPermission.actions.map((a) => a.action);

//       // Ensure the user has ALL required actions (every action in the actions array must be present)
//       const hasAllActions = actions.every((requiredAction) => userActions.includes(requiredAction));

//       // return hasAllActions;

//       // Return false if the user doesn't have all actions required, otherwise continue to the next permission
//       if (!hasAllActions) {
//         return false;
//       } else {
//         continue;
//       }
//     }

//     return true;
//   }
// }
