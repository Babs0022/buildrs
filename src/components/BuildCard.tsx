import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Button } from "./ui/button";

interface BuildCardProps {
  avatarImage: string;
  name: string;
  title: string;
  description: string;
  upvotes: number;
}

export const BuildCard: React.FC<BuildCardProps> = ({
  avatarImage,
  name,
  title,
  description,
  upvotes,
}) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarImage src={avatarImage} />
            <AvatarFallback>{name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-lg font-bold">{name}</h3>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        <p>{description}</p>
      </CardContent>
      <CardFooter>
        <Button variant="outline">Upvote ({upvotes})</Button>
      </CardFooter>
    </Card>
  );
};
