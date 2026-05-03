"use client"

export async function signUpUser(formData) {
    try {
        const res = await fetch("/api/auth/signup", {
            method: "POST",
            body: JSON.stringify(formData),
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (!res.ok) {
            throw new Error(result.message || "Something went wrong");
        }
        const result = await res.json();

        return result;
    } catch (e) {
        throw e
    }
}



export async function signInUser(formData) {

    try {
        const res = await fetch("/api/auth/signin", {
            method: "POST",
            body: JSON.stringify(formData),
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });

        const result = await res.json();
        if (!res.ok) {
            throw new Error(result.message || "Something went wrong");
        }



        return result.data;

    } catch (e) {
       
        throw e;
    }
}

export async function fetchUser() {
    try {
        const res = await fetch("/api/auth/my", {
            method: "GET",
            credentials: "include"
        });
        if(res.status===401){
            throw new Error("LOGIN _ERROR")
        }
        const result = await res.json();
        if (!res.ok) {
            const err = new Error(result.message || "Something went wrong");
            err.status = res.status; 
            throw err;
        }
        return result.data;
    } catch (e) {
        throw e
    }
}


export async function blogpost(blogdata) {
    try {
        const res = await fetch("/api/auth/upload", {
            method: "POST",
            body: blogdata,
            credentials: "include",
        });

        const result = await res.json();
        if (!res.ok) {
            throw new Error(result.message || "Something went wrong");
        }

        return result.data;

    } catch (e) {
        throw e;
    }
}


export async function getAllFollowers() {
    try {
        const res = await fetch("/api/auth/allfollowers", {
            method: "GET",
            credentials: "include"
        });
        const result = await res.json();
        if (!res.ok) {
            const err = new Error()
            err.message = result.message || "Something went wrong";
            err.status = result.status || 500
            throw err
        }
        return result.data;
    } catch (e) {
        throw e

    }
}