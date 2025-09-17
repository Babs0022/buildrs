"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from "sonner";

type BuildType = 'Launch' | 'Update' | 'Experiment';

export default function AddBuildPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');
  const [tags, setTags] = useState('');
  const [buildType, setBuildType] = useState<BuildType>('Launch');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("You must be logged in to add a build.");
      return;
    }
    setIsLoading(true);

    try {
      await addDoc(collection(db, 'builds'), {
        userId: user.uid,
        title,
        description,
        link,
        tags: tags.split(',').map(tag => tag.trim()),
        type: buildType,
        createdAt: serverTimestamp(),
      });
      
      toast.success("Build added successfully!");
      router.push('/feed');

    } catch (error) {
      console.error("Error adding document: ", error);
      toast.error("Failed to add build. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-8rem)]">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Add a New Build</CardTitle>
          <CardDescription>Showcase your latest project to the community.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" placeholder="My Awesome Project" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input id="description" placeholder="A brief description of what you built." value={description} onChange={(e) => setDescription(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="link">Link</Label>
              <Input id="link" type="url" placeholder="https://myproject.com" value={link} onChange={(e) => setLink(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input id="tags" placeholder="AI, SaaS, Next.js" value={tags} onChange={(e) => setTags(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Build Type</Label>
              <div className="flex space-x-4 pt-2">
                {(['Launch', 'Update', 'Experiment'] as BuildType[]).map((type) => (
                  <Button
                    key={type}
                    type="button"
                    variant={buildType === type ? 'default' : 'secondary'}
                    onClick={() => setBuildType(type)}
                  >
                    {type}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Submitting...' : 'Submit Build'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}