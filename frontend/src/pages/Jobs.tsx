import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Briefcase, Clock, Sparkles } from "lucide-react";

const mockJobs = [
  {
    id: 1,
    title: "Frontend Developer",
    company: "Tech Solutions Ltd",
    location: "Remote",
    type: "Full-time",
    skills: ["React", "TypeScript", "Tailwind"],
    description: "Build modern web applications using React and TypeScript",
    source: "recruiter",
    postedAt: "2 days ago"
  },
  {
    id: 2,
    title: "Full Stack Engineer",
    company: "StartUp Hub",
    location: "Bangalore",
    type: "Full-time",
    skills: ["Node.js", "React", "MongoDB"],
    description: "Work on exciting startup projects with modern tech stack",
    source: "ai",
    postedAt: "1 week ago"
  },
  {
    id: 3,
    title: "UI/UX Designer",
    company: "Creative Agency",
    location: "Mumbai",
    type: "Contract",
    skills: ["Figma", "Design Systems", "User Research"],
    description: "Design beautiful and intuitive user experiences",
    source: "recruiter",
    postedAt: "3 days ago"
  },
];

const Jobs = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);

  const allSkills = Array.from(new Set(mockJobs.flatMap(job => job.skills)));

  const filteredJobs = mockJobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSkill = !selectedSkill || job.skills.includes(selectedSkill);
    return matchesSearch && matchesSkill;
  });

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-foreground">Find Your Next Opportunity</h1>
          <p className="text-muted-foreground">Discover jobs matched to your skills and interests</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search jobs by title or company..."
              className="pl-10 h-12"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedSkill === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedSkill(null)}
            >
              All Skills
            </Button>
            {allSkills.map(skill => (
              <Button
                key={skill}
                variant={selectedSkill === skill ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedSkill(skill)}
              >
                {skill}
              </Button>
            ))}
          </div>
        </div>

        {/* Job Listings */}
        <div className="space-y-4">
          {filteredJobs.map(job => (
            <Card key={job.id} className="p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-bold text-card-foreground">{job.title}</h3>
                    {job.source === "ai" && (
                      <Badge variant="secondary" className="bg-accent/10 text-accent">
                        <Sparkles className="h-3 w-3 mr-1" />
                        AI Sourced
                      </Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground font-medium">{job.company}</p>
                </div>
                <Button>Apply Now</Button>
              </div>

              <p className="text-muted-foreground mb-4">{job.description}</p>

              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {job.location}
                </div>
                <div className="flex items-center gap-1">
                  <Briefcase className="h-4 w-4" />
                  {job.type}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {job.postedAt}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {job.skills.map(skill => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Jobs;
