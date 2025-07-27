import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import QuestionFeed from "@/components/QuestionFeed";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />
      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          <QuestionFeed />
          <Sidebar />
        </div>
      </div>
    </div>
  );
};

export default Index;
