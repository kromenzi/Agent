import { useState } from "react";
import { Link } from "wouter";
import { Plus, Github, Upload, Server, Play, Square, CircleOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MOCK_PROJECTS, Project } from "@/lib/mockData";
import { Badge } from "@/components/ui/badge";

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [isImportGithubOpen, setIsImportGithubOpen] = useState(false);
  const [githubUrl, setGithubUrl] = useState("");

  const getStatusBadge = (status: Project["status"]) => {
    switch (status) {
      case "running":
        return <Badge className="bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/20 gap-1.5"><Play className="w-3 h-3" /> يعمل</Badge>;
      case "stopped":
        return <Badge variant="secondary" className="gap-1.5"><Square className="w-3 h-3" /> متوقف</Badge>;
      case "failed":
        return <Badge variant="destructive" className="gap-1.5"><CircleOff className="w-3 h-3" /> فشل</Badge>;
    }
  };

  const handleImportGithub = () => {
    // Mock creating a new project
    const newProject: Project = {
      id: `proj_${Date.now()}`,
      name: githubUrl.split('/').pop() || "New Project",
      status: "stopped",
      stack: "Unknown",
      lastUpdated: new Date().toISOString()
    };
    setProjects([newProject, ...projects]);
    setIsImportGithubOpen(false);
    setGithubUrl("");
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">المشاريع</h2>
          <p className="text-muted-foreground mt-1">قم بإدارة مشاريعك أو إنشاء مشروع جديد</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <Dialog open={isImportGithubOpen} onOpenChange={setIsImportGithubOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Github className="w-4 h-4" />
                استيراد من GitHub
              </Button>
            </DialogTrigger>
            <DialogContent dir="rtl">
              <DialogHeader>
                <DialogTitle>استيراد مستودع GitHub</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>رابط المستودع (URL)</Label>
                  <Input 
                    placeholder="https://github.com/username/repo" 
                    dir="ltr"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsImportGithubOpen(false)}>إلغاء</Button>
                <Button onClick={handleImportGithub} disabled={!githubUrl}>استيراد وبناء</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button variant="outline" className="gap-2">
            <Upload className="w-4 h-4" />
            رفع ZIP
          </Button>

          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            مشروع جديد
          </Button>
        </div>
      </div>

      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center border rounded-xl border-dashed border-border bg-card/30">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Server className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-lg font-semibold mb-2">لا توجد مشاريع</h3>
          <p className="text-muted-foreground max-w-sm mb-6">قم بإنشاء مشروعك الأول الآن وابدأ في البناء والاختبار الفوري.</p>
          <Button className="gap-2"><Plus className="w-4 h-4" /> مشروع جديد</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {projects.map((project) => (
            <Card key={project.id} className="group hover:border-primary/50 transition-colors bg-card/50 backdrop-blur-sm border-border/50 flex flex-col">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="p-2 rounded-md bg-primary/10 text-primary">
                    <Server className="w-5 h-5" />
                  </div>
                  {getStatusBadge(project.status)}
                </div>
                <CardTitle className="text-xl line-clamp-1">{project.name}</CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs font-mono">{project.stack}</Badge>
                  <span className="text-xs">تحديث: {new Date(project.lastUpdated).toLocaleDateString('ar-EG')}</span>
                </CardDescription>
              </CardHeader>
              <div className="flex-1" />
              <CardFooter className="pt-4 border-t border-border/50">
                <Link href={`/projects/${project.id}`} className="w-full">
                  <Button variant="secondary" className="w-full gap-2 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                    فتح مساحة العمل
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
