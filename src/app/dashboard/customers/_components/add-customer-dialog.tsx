"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus } from "lucide-react"

export function AddCustomerDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="rounded-full shadow-lg shadow-primary/20">
          <Plus className="w-4 h-4 mr-2" /> Add Customer
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] rounded-3xl">
        <DialogHeader>
          <DialogTitle>Add Customer</DialogTitle>
          <DialogDescription>
            Enter the details of the new customer here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" placeholder="Rahul Sharma" className="rounded-xl" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" placeholder="+91 98765 43210" className="rounded-xl" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email (Optional)</Label>
            <Input id="email" placeholder="rahul@example.com" className="rounded-xl" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="address">Address</Label>
            <Textarea 
                id="address" 
                placeholder="B-402, Galaxy Heights..." 
                className="rounded-xl resize-none" 
                rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" className="rounded-xl w-full">Save Customer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
