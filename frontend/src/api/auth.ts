import axios from "axios";

const authClient = axios.create({
  baseURL: "/api/auth",
});

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
  tokenType?: string;
  expiresIn?: number;
  username: string;
  roles: string[] | Set<string>;
}

// Wrapper pour adapter la réponse du backend
export interface AuthResponseWrapper {
  token: string;
  user: {
    username: string;
    roles: string[];
  };
}

export const authApi = {
  login: async (data: LoginRequest): Promise<AuthResponseWrapper> => {
    const response = await authClient.post<AuthResponse>("/login", data);
    const authResponse = response.data;
    
    // Transform backend response to frontend format
    return {
      token: authResponse.accessToken,
      user: {
        username: authResponse.username,
        roles: Array.isArray(authResponse.roles) 
          ? authResponse.roles 
          : Array.from(authResponse.roles as Set<string>)
      }
    };
  },

  register: async (data: RegisterRequest): Promise<AuthResponseWrapper> => {
    const response = await authClient.post<AuthResponse>("/register", data);
    const authResponse = response.data;
    
    // Transform backend response to frontend format
    return {
      token: authResponse.accessToken,
      user: {
        username: authResponse.username,
        roles: Array.isArray(authResponse.roles) 
          ? authResponse.roles 
          : Array.from(authResponse.roles as Set<string>)
      }
    };
  },

  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    const response = await authClient.post<AuthResponse>(
      "/refresh",
      {},
      {
        headers: {
          "Refresh-Token": refreshToken,
        },
      }
    );
    return response.data;
  },

  validateToken: async (token: string): Promise<boolean> => {
    try {
      const response = await authClient.get<boolean>("/validate", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch {
      return false;
    }
  },
};
