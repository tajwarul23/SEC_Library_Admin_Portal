export const authApi = {
  login: async (credentials) => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    const emailClean = credentials.email.trim().toLowerCase();
    if (emailClean === "admin@sec.ac.bd" && credentials.password === "password") {
      return {
        email: "admin@sec.ac.bd",
        name: "Prof. Dr. M. A. Rahman",
        role: "Head Librarian & System Administrator",
        avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"
      };
    } else if (emailClean === "librarian@sec.ac.bd" && credentials.password === "sec123") {
      return {
        email: "librarian@sec.ac.bd",
        name: "Engr. Shahinur Islam",
        role: "Assistant Librarian",
        avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150"
      };
    } else {
      throw new Error("Invalid institutional email or admin security password.");
    }
  },
  logout: async () => {
    await new Promise((resolve) => setTimeout(resolve, 300));
  }
};
