import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function TabsTest() {
  const [activeTab, setActiveTab] = useState('tab1');
  
  console.log('TabsTest render - activeTab:', activeTab);
  
  const handleTabChange = (value: string) => {
    console.log('Tab change requested:', value);
    setActiveTab(value);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Tabs Test Page</h1>
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
          <TabsTrigger value="tab3">Tab 3</TabsTrigger>
        </TabsList>
        
        <TabsContent value="tab1" className="mt-4">
          <div className="p-4 bg-blue-100 rounded">
            <h2 className="text-xl font-bold">Tab 1 Content</h2>
            <p>This is the content for Tab 1</p>
          </div>
        </TabsContent>
        
        <TabsContent value="tab2" className="mt-4">
          <div className="p-4 bg-green-100 rounded">
            <h2 className="text-xl font-bold">Tab 2 Content</h2>
            <p>This is the content for Tab 2</p>
          </div>
        </TabsContent>
        
        <TabsContent value="tab3" className="mt-4">
          <div className="p-4 bg-red-100 rounded">
            <h2 className="text-xl font-bold">Tab 3 Content</h2>
            <p>This is the content for Tab 3</p>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="mt-8 p-4 bg-gray-100 rounded">
        <p className="font-mono">Active tab: {activeTab}</p>
      </div>
    </div>
  );
}
