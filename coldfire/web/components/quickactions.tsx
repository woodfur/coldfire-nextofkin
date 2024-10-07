import React from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UserPlusIcon, ClockIcon } from 'lucide-react'

export default function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Button className="w-full"><UserPlusIcon className="mr-2 h-4 w-4" /> Add Beneficiary</Button>
        <Button className="w-full"><ClockIcon className="mr-2 h-4 w-4" /> Create Plan</Button>
      </CardContent>
    </Card>
  )
}