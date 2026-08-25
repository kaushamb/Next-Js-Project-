const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

class ApiClient {
    private baseUrl: string;

    constructor(){
        this,this.baseUrl=API_BASE_URL
    }

    async request (endpoint: string, options: RequestInit ={}){
        const url =`${this.baseUrl}${endpoint}`;
        const config: RequestInit ={
            headers :{
                "Content-Type":"application/json",
                ...options.headers,
            },
            credentials :"include",//important for cookies
            ...options,
        };
        const response = await fetch(url,config)

        //Handle 401 (unauthorized) gracefully 
        if(response.status ===401){
            return null;
        }
        if(!response.ok){
            const error = await response.json().catch(()=>({
            error: "Network error"
            }));
            throw new Error(error.error || "Request failed")
        }
    }

    //Auth Methods

    async register(userData: unknown){
        return this.request('/api/auth/register',{
            method:"POST",
            body : JSON.stringify({userData}),
        });
    }

    async login(email: string, password: string){
        return this.request("/api/auth/login",{
            method:"POST",
            body: JSON.stringify({email, password}),
        })
    }

    async logout(){
        return this.request("/api/auth/logout",{
            method:"POST",
        })
    }

    async getCurrentUser(){
        return this.request("/api/auth/logout")
    }

    //User Methods 
    async getUsers(){
        return this.request("/api/users");
    }

    //Admin Methods
    async updateUserRole(userId: string, role: string){
        return this.request(`/api/users/${userId}/role`,{
            method:"PATCH",
            body: JSON.stringify({role})
        });
    }

    async assignUserToTeam(userId: string, teamId: string){
        return this.request(`/api/users/${userId}/role`,{
            method:"PATCH",
            body: JSON.stringify({teamId})
        });
    }

}

export const apiClient = new ApiClient();
