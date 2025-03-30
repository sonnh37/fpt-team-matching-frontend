class ReviewDetailsRBAC {
    private RBACDetails: Record<string, Set<string>> = {}

    public registerRole (roleName: string, actions: string[]) : void {
        if (this.RBACDetails[roleName] == undefined) {
            this.RBACDetails[roleName] = new Set()
        }
        for (const action in actions) {
            this.RBACDetails[roleName].add(actions[action])
        }
    }

    public hasPermission (roleName: string, action: string) : boolean {
        if (this.RBACDetails[roleName] == undefined) {
            return false;
        }
        return this.RBACDetails[roleName].has(action) ?? false
    }
}

export const reviewDetailsRBAC = new ReviewDetailsRBAC();