'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { SetupTask, BankAccountData } from '@/types/merchant-onboarding';
import { DEFAULT_SETUP_TASKS } from '@/lib/merchant-mock-data';
import {
  CheckCircle2,
  Circle,
  ChevronDown,
  ChevronUp,
  Loader2,
  ExternalLink,
  Package,
  CreditCard,
  Database,
  Plug,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step4SetupProps {
  onComplete: () => void;
  cohort: 'self-serve' | 'assisted' | 'managed';
  assignedSpecialist?: {
    name: string;
    role: 'AE' | 'IC';
  };
}

const TASK_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  'account-created': CheckCircle2,
  'software-activated': CheckCircle2,
  'hardware-shipped': Package,
  'setup-hardware': Package,
  'connect-bank': CreditCard,
  'import-data': Database,
  'configure-integrations': Plug,
};

export function Step4Setup({ onComplete, cohort, assignedSpecialist }: Step4SetupProps) {
  const [tasks, setTasks] = useState<SetupTask[]>(DEFAULT_SETUP_TASKS);
  const [expandedTask, setExpandedTask] = useState<string | null>(null);
  const [showBankForm, setShowBankForm] = useState(false);
  const [bankData, setBankData] = useState<Partial<BankAccountData>>({});

  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length;
  const progress = (completedCount / totalCount) * 100;
  const requiredCompleted = tasks.filter(t => t.required && t.completed).length;
  const requiredTotal = tasks.filter(t => t.required).length;

  const toggleTask = (taskId: string) => {
    setExpandedTask(expandedTask === taskId ? null : taskId);
  };

  const completeTask = (taskId: string) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId ? { ...task, completed: true, status: 'completed' as const } : task
      )
    );

    // Auto-collapse after completing
    setTimeout(() => {
      setExpandedTask(null);
    }, 500);
  };

  const handleBankSubmit = async () => {
    // Simulate bank verification
    await new Promise(resolve => setTimeout(resolve, 1500));
    completeTask('connect-bank');
    setShowBankForm(false);
  };

  const handleFinish = () => {
    if (requiredCompleted === requiredTotal) {
      onComplete();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Card */}
      <Card>
        <CardContent className="py-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Welcome to Lightspeed!</h2>
                <p className="text-muted-foreground">
                  Complete these tasks to start accepting payments
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-blue-600">
                  {completedCount}/{totalCount}
                </div>
                <p className="text-sm text-muted-foreground">Tasks Complete</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Overall Progress</span>
                <span className="font-medium">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Specialist Card (Assisted/Managed) */}
      {cohort !== 'self-serve' && assignedSpecialist && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-blue-200 bg-blue-50/50">
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-semibold">
                    {assignedSpecialist.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-medium">
                      {assignedSpecialist.name} is here to help
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {cohort === 'managed'
                        ? 'Your dedicated implementation specialist'
                        : 'Book a setup session if you need assistance'}
                    </p>
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  Schedule Call
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Task List */}
      <div className="space-y-3">
        {tasks.map((task, index) => {
          const Icon = TASK_ICONS[task.id] || Circle;
          const isExpanded = expandedTask === task.id;
          const canExpand = !task.completed && task.instructions;

          return (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card
                className={cn(
                  'transition-all',
                  task.completed && 'bg-green-50/50 border-green-200',
                  canExpand && 'cursor-pointer hover:shadow-md'
                )}
                onClick={() => canExpand && toggleTask(task.id)}
              >
                <CardContent className="py-4">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div
                      className={cn(
                        'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0',
                        task.completed
                          ? 'bg-green-600 text-white'
                          : 'bg-muted text-muted-foreground'
                      )}
                    >
                      {task.completed ? (
                        <CheckCircle2 className="w-6 h-6" />
                      ) : (
                        <Icon className="w-6 h-6" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{task.title}</h3>
                            {!task.required && (
                              <Badge variant="secondary" className="text-xs">
                                Optional
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {task.description}
                          </p>

                          {/* Special handling for hardware shipped */}
                          {task.id === 'hardware-shipped' && task.completed && (
                            <Button variant="link" className="p-0 h-auto mt-2 text-sm" asChild>
                              <a href="#" className="flex items-center gap-1">
                                Track shipment
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </Button>
                          )}
                        </div>

                        {/* Expand indicator */}
                        {canExpand && (
                          <Button variant="ghost" size="sm" className="flex-shrink-0">
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </Button>
                        )}
                      </div>

                      {/* Expanded Content */}
                      <AnimatePresence>
                        {isExpanded && task.instructions && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="mt-4 pt-4 border-t space-y-4">
                              <div className="prose prose-sm max-w-none">
                                <p className="text-sm text-muted-foreground whitespace-pre-line">
                                  {task.instructions}
                                </p>
                              </div>

                              {/* Special forms */}
                              {task.id === 'connect-bank' && !showBankForm && (
                                <Button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setShowBankForm(true);
                                  }}
                                  size="sm"
                                >
                                  Connect Bank Account
                                </Button>
                              )}

                              {task.id === 'connect-bank' && showBankForm && (
                                <div
                                  className="space-y-4 bg-white p-4 rounded-lg border"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <Label>Account Holder Name</Label>
                                      <Input
                                        value={bankData.accountHolderName}
                                        onChange={(e) =>
                                          setBankData(prev => ({ ...prev, accountHolderName: e.target.value }))
                                        }
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label>Bank Name</Label>
                                      <Input
                                        value={bankData.bankName}
                                        onChange={(e) =>
                                          setBankData(prev => ({ ...prev, bankName: e.target.value }))
                                        }
                                      />
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <Label>Routing Number</Label>
                                      <Input
                                        value={bankData.routingNumber}
                                        onChange={(e) =>
                                          setBankData(prev => ({ ...prev, routingNumber: e.target.value }))
                                        }
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label>Account Number</Label>
                                      <Input
                                        value={bankData.accountNumber}
                                        onChange={(e) =>
                                          setBankData(prev => ({ ...prev, accountNumber: e.target.value }))
                                        }
                                      />
                                    </div>
                                  </div>

                                  <div className="space-y-2">
                                    <Label>Account Type</Label>
                                    <Select
                                      value={bankData.accountType}
                                      onValueChange={(value: 'checking' | 'savings') =>
                                        setBankData(prev => ({ ...prev, accountType: value }))
                                      }
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select account type" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="checking">Checking</SelectItem>
                                        <SelectItem value="savings">Savings</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>

                                  <div className="flex gap-2">
                                    <Button onClick={handleBankSubmit} size="sm">
                                      Submit
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => setShowBankForm(false)}
                                    >
                                      Cancel
                                    </Button>
                                  </div>
                                </div>
                              )}

                              {/* Generic completion button for other tasks */}
                              {task.id !== 'connect-bank' && (
                                <Button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    completeTask(task.id);
                                  }}
                                  size="sm"
                                >
                                  Mark as Complete
                                </Button>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Completion Card */}
      {requiredCompleted === requiredTotal && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card className="border-green-200 bg-gradient-to-br from-green-50 to-blue-50">
            <CardContent className="py-6">
              <div className="text-center space-y-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                >
                  <Sparkles className="w-16 h-16 mx-auto text-green-600" />
                </motion.div>
                <div>
                  <h3 className="text-2xl font-bold">You're All Set!</h3>
                  <p className="text-muted-foreground mt-2">
                    Your Lightspeed POS is ready to process payments
                  </p>
                </div>
                <Button onClick={handleFinish} size="lg" className="mt-4">
                  Go to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Status Badge */}
      <Card>
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Payment Processing Status</p>
              <p className="text-sm text-muted-foreground">
                {tasks.find(t => t.id === 'connect-bank')?.completed
                  ? 'Active - Payouts enabled'
                  : 'Active - Payouts pending bank verification'}
              </p>
            </div>
            <Badge variant={tasks.find(t => t.id === 'connect-bank')?.completed ? 'default' : 'secondary'}>
              {tasks.find(t => t.id === 'connect-bank')?.completed ? 'Fully Active' : 'Pending'}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
