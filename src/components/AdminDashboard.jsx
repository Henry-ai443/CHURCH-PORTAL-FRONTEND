
import React from "react";
import AdminWelcomeHeader from "./Admin/AdminWelcomeHeader";
import QuickStats from "./Admin/Quickstats";

const AdminDashboard = () => {
    return(

        <>

        <main 
        style={{
            marginTop:"40px"
        }}
        >
            <AdminWelcomeHeader/>
            <QuickStats/>
        </main>
        </>

    )
}

export default AdminDashboard