import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { 
  ArrowRight, Play, Square, Terminal, Code2, 
  Bot, RefreshCw, AlertTriangle, CheckCircle2,
  FileCode2, FolderTree, Package, Settings, MonitorPlay
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MOCK_PROJECTS, MOCK_LOGS, MOCK_FILE_TREE } from "@/lib/mockData";
import { Input } from "@/components/ui/input";

export default function ProjectDetails({ id }: { id: string }) {
  const project = MOCK_PROJECTS.find(p => p.id === id) || MOCK_PROJECTS[0];
  const [isRunning, setIsRunning] = useState(project.status === "running");
  const [logs, setLogs] = useState<string[]>(MOCK_LOGS);
  const [activeTab, setActiveTab] = useState("overview");
  
  // Agent State
  const [agentInput, setAgentInput] = useState("");
  const [agentMessages, setAgentMessages] = useState([
    { role: "agent", content: "مرحباً! أنا المساعد الذكي الخاص بك. يمكنني مساعدتك في تحليل الكود، كتابة التعديلات (/ai/patch) أو التخطيط لميزات جديدة (/ai/plan)." }
  ]);

  const toggleRun = () => {
    setIsRunning(!isRunning);
    if (!isRunning) {
      setLogs(prev => [...prev, "> Starting script...", "Running in Sandbox environment..."]);
    } else {
      setLogs(prev => [...prev, "> Process terminated."]);
    }
  };

  const handleAgentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agentInput.trim()) return;

    const newMsg = { role: "user", content: agentInput };
    setAgentMessages(prev => [...prev, newMsg]);
    setAgentInput("");

    // Mock AI response
    setTimeout(() => {
      setAgentMessages(prev => [...prev, { 
        role: "agent", 
        content: `تم استلام طلبك. سأقوم بإعداد Patch جديد لتعديل الملفات المطلوبة. (Mock Response)` 
      }]);
    }, 1000);
  };

  const FileNode = ({ node, depth = 0 }: { node: any, depth?: number }) => (
    <div style={{ paddingRight: `${depth * 16}px` }} className="flex items-center gap-2 py-1.5 px-2 hover:bg-muted/50 rounded-md cursor-pointer text-sm">
      {node.type === "folder" ? (
        <FolderTree className="w-4 h-4 text-muted-foreground" />
      ) : node.name.endsWith(".json") ? (
        <Package className="w-4 h-4 text-orange-400" />
      ) : node.name.endsWith(".ts") || node.name.endsWith(".tsx") ? (
        <FileCode2 className="w-4 h-4 text-blue-400" />
      ) : (
        <Code2 className="w-4 h-4 text-muted-foreground" />
      )}
      <span dir="ltr">{node.name}</span>
    </div>
  );

  const renderFileTree = (nodes: any[], depth = 0) => {
    return nodes.map((node, i) => (
      <div key={i}>
        <FileNode node={node} depth={depth} />
        {node.children && renderFileTree(node.children, depth + 1)}
      </div>
    ));
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <header className="bg-card border-b border-border p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <Link href="/projects">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h2 className="font-bold text-lg flex items-center gap-2">
              {project.name}
              {isRunning ? (
                <Badge className="bg-green-500/10 text-green-500 border-green-500/20 text-xs py-0 h-5">يعمل</Badge>
              ) : (
                <Badge variant="secondary" className="text-xs py-0 h-5">متوقف</Badge>
              )}
            </h2>
            <p className="text-xs text-muted-foreground font-mono" dir="ltr">{project.id}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <MonitorPlay className="w-4 h-4" />
            معاينة ويب
          </Button>
          <Button 
            variant={isRunning ? "destructive" : "default"} 
            size="sm" 
            className="gap-2 min-w-[120px]"
            onClick={toggleRun}
          >
            {isRunning ? (
              <><Square className="w-4 h-4" /> إيقاف الخادم</>
            ) : (
              <><Play className="w-4 h-4" /> تشغيل الخادم</>
            )}
          </Button>
        </div>
      </header>

      {/* Main Content Area - Tabs */}
      <Tabs defaultValue="overview" className="flex-1 flex flex-col" onValueChange={setActiveTab}>
        <div className="px-4 pt-4 border-b border-border bg-background shrink-0">
          <TabsList className="bg-muted/50 h-10 w-full sm:w-auto">
            <TabsTrigger value="overview" className="gap-2 data-[state=active]:bg-card"><Code2 className="w-4 h-4"/> نظرة عامة & الملفات</TabsTrigger>
            <TabsTrigger value="agent" className="gap-2 data-[state=active]:bg-card"><Bot className="w-4 h-4"/> المساعد الذكي (Agent)</TabsTrigger>
            <TabsTrigger value="runner" className="gap-2 data-[state=active]:bg-card"><Terminal className="w-4 h-4"/> سطر الأوامر (Runner)</TabsTrigger>
          </TabsList>
        </div>

        {/* Overview Tab */}
        <TabsContent value="overview" className="flex-1 m-0 h-full overflow-hidden data-[state=inactive]:hidden flex flex-col md:flex-row">
          {/* File Tree Panel */}
          <div className="w-full md:w-64 border-l border-border bg-card/30 flex flex-col shrink-0 h-64 md:h-full">
            <div className="p-3 border-b border-border text-sm font-medium flex items-center gap-2">
              <FolderTree className="w-4 h-4" /> مستكشف الملفات
            </div>
            <ScrollArea className="flex-1 p-2" dir="ltr">
              {renderFileTree(MOCK_FILE_TREE)}
            </ScrollArea>
          </div>
          {/* Editor/Details Panel */}
          <div className="flex-1 p-6 bg-background overflow-y-auto">
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="flex items-center gap-4 p-4 rounded-lg border border-border bg-card/50">
                <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <Settings className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">اكتشاف بيئة العمل (Stack Detect)</h3>
                  <p className="text-sm text-muted-foreground">تم التعرف على المشروع كـ React + Vite + Tailwind</p>
                </div>
                <div className="mr-auto">
                  <Badge variant="outline" className="font-mono bg-background">Node.js 20.x</Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg border border-border bg-card/30 space-y-2">
                  <h4 className="font-medium text-sm text-muted-foreground">حالة الحزم</h4>
                  <div className="flex items-center gap-2 text-green-500 text-sm">
                    <CheckCircle2 className="w-4 h-4" /> تم التثبيت بنجاح
                  </div>
                </div>
                <div className="p-4 rounded-lg border border-border bg-card/30 space-y-2">
                  <h4 className="font-medium text-sm text-muted-foreground">حالة الخادم</h4>
                  <div className="flex items-center gap-2 text-sm">
                    {isRunning ? (
                      <span className="text-green-500 flex items-center gap-2"><RefreshCw className="w-4 h-4 animate-spin" /> قيد التشغيل على منفذ 5000</span>
                    ) : (
                      <span className="text-muted-foreground flex items-center gap-2"><Square className="w-4 h-4" /> متوقف</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Agent Tab */}
        <TabsContent value="agent" className="flex-1 m-0 h-full overflow-hidden data-[state=inactive]:hidden flex flex-col bg-background relative">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {agentMessages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl p-4 ${
                  msg.role === 'user' 
                    ? 'bg-primary text-primary-foreground rounded-tr-sm' 
                    : 'bg-muted rounded-tl-sm border border-border'
                }`}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  
                  {/* Mock Safety Gate for Agent Responses */}
                  {msg.role === 'agent' && i > 0 && (
                    <div className="mt-4 p-3 bg-background rounded-lg border border-border">
                      <div className="flex items-center gap-2 text-sm font-medium mb-2 text-orange-400">
                        <AlertTriangle className="w-4 h-4" /> بوابة الأمان (Safety Gate)
                      </div>
                      <p className="text-xs text-muted-foreground mb-3">يطلب المساعد تعديل ملف <code dir="ltr" className="bg-muted px-1 rounded">server/index.ts</code></p>
                      <div className="flex gap-2">
                        <Button size="sm" className="bg-green-500 hover:bg-green-600 text-white">الموافقة على التعديل (Apply)</Button>
                        <Button size="sm" variant="outline">رفض التعديل</Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-border bg-card shrink-0">
            <form onSubmit={handleAgentSubmit} className="flex gap-2 max-w-4xl mx-auto">
              <Input 
                value={agentInput}
                onChange={(e) => setAgentInput(e.target.value)}
                placeholder="أخبرني بما تريد تعديله... (مثال: /ai/plan أضف نظام تسجيل دخول)" 
                className="flex-1 bg-background"
              />
              <Button type="submit" disabled={!agentInput.trim()}>إرسال</Button>
            </form>
          </div>
        </TabsContent>

        {/* Runner Tab */}
        <TabsContent value="runner" className="flex-1 m-0 h-full overflow-hidden data-[state=inactive]:hidden flex flex-col bg-black">
          <div className="flex items-center justify-between p-2 border-b border-zinc-800 bg-zinc-950 shrink-0">
            <div className="flex gap-2 px-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="ghost" className="h-7 text-xs text-zinc-400 hover:text-white" onClick={() => setLogs(["> Terminal cleared."])}>
                مسح الشاشة (Clear)
              </Button>
              <Button size="sm" variant="secondary" className="h-7 text-xs gap-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-100">
                <RefreshCw className="w-3 h-3" /> npm install
              </Button>
            </div>
          </div>
          <ScrollArea className="flex-1 p-4" dir="ltr">
            <div className="font-mono text-sm space-y-1">
              {logs.map((log, i) => (
                <div key={i} className={`
                  ${log.includes("error") || log.includes("failed") ? "text-red-400" : ""}
                  ${log.includes("success") || log.includes("ready") ? "text-green-400" : ""}
                  ${log.includes("http") ? "text-blue-400" : "text-zinc-300"}
                `}>
                  {log}
                </div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}
