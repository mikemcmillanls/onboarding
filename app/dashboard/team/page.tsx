'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

export default function TeamSetupPage() {
  const router = useRouter();
  const [teamMembers, setTeamMembers] = useState([{ email: '', role: 'Staff' }]);

  const addTeamMember = () => {
    setTeamMembers([...teamMembers, { email: '', role: 'Staff' }]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Save team members
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6 md:p-8">
        <Link href="/dashboard">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
              <Users className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Team Setup</h1>
              <p className="text-gray-600">Invite team members (Optional)</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Add Team Members</CardTitle>
              <CardDescription>
                Invite staff to access your Lightspeed account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {teamMembers.map((member, index) => (
                  <div key={index} className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label>Email Address</Label>
                      <Input
                        type="email"
                        placeholder="team@example.com"
                        value={member.email}
                        onChange={(e) => {
                          const updated = [...teamMembers];
                          updated[index].email = e.target.value;
                          setTeamMembers(updated);
                        }}
                      />
                    </div>
                    <div>
                      <Label>Role</Label>
                      <Input
                        value={member.role}
                        onChange={(e) => {
                          const updated = [...teamMembers];
                          updated[index].role = e.target.value;
                          setTeamMembers(updated);
                        }}
                      />
                    </div>
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  onClick={addTeamMember}
                  className="w-full"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Another Team Member
                </Button>

                <div className="flex gap-4">
                  <Button type="submit" className="bg-red-600 hover:bg-red-700">
                    Send Invitations
                  </Button>
                  <Link href="/dashboard">
                    <Button type="button" variant="outline">Skip for Now</Button>
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
