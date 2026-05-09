import { LiveSearch } from "./LiveSearch";

type HeroSearchProps = {
  suggestions: string[];
  initialQuery?: string;
};

export function HeroSearch({ suggestions, initialQuery }: HeroSearchProps) {
  return <LiveSearch initialQuery={initialQuery} suggestions={suggestions} />;
}
