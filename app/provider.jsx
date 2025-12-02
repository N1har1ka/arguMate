"use client"
import AppContextProvider from '@/context/AppContext';
import { UserDetailContext } from '@/context/UserDetailContext';
import { supabase } from '@/services/supabaseclient'
import React, { useContext, useEffect, useState } from 'react'

const Provider = ({children}) => {
    const[user,setUser]=useState();
     useEffect(()=>{
        createNewUSer();
    },[])
    const createNewUSer=()=>{
        supabase.auth.getUser().then(async ({data:{user}})=>{

            //check if user exists
            let {data:Users,error}=await supabase
            .from("Users")
            .select("*")
            .eq('email',user?.email);
            console.log("existing user check",Users);

            //if not create new user
            if(Users?.length===0){
                const {data,error}=await supabase.from("Users")
                .insert([
                    {
                    name:user?.user_metadata?.name,
                    email:user?.email,
                    picture:user?.user_metadata?.picture
                    }
                ])
                setUser(data);
                console.log("new user created",data);
                return;
            }
            setUser(Users?.[0]);
        })
    }
   
  return (
    <AppContextProvider>
    <UserDetailContext.Provider value={{user,setUser}}>
        <div>{children}</div>
    </UserDetailContext.Provider>
    </AppContextProvider>
  )
}

export default Provider
export const useUser=()=>{
    const context=useContext(UserDetailContext);
    return context;
}