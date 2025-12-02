"use client"
import React from 'react'
import WelcomeContainer from './_components/WelcomeContainer'
import CreateOptions from './_components/CreateOptions'
import LatestInterviewsList from './_components/LatestInterviewsList'
import DashboardStats from './_components/DashboardStats'


const Dashboard = () => {
  return (
    <div>
        {/* <WelcomeContainer/> */}
        <h2 className='my-1 font-bold text-2xl '>Dashboard</h2>
        <CreateOptions/>
        <DashboardStats/>
        <LatestInterviewsList/>
    </div>
  )
}

export default Dashboard