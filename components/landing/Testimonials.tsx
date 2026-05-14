import { Card } from "@/components/ui/card";

const quotes = [
  ["I used to spiral after bedtime battles. Nurturely helps me take one calm next step.", "Maya, parent of two"],
  ["The stories are sweet, short, and somehow exactly what my son wants to hear.", "Jordan, dad of a 5-year-old"],
  ["It feels like texting the friend who always knows how to lower the temperature.", "Priya, mom of a toddler"]
];

export function Testimonials() {
  return (
    <section className="mx-auto max-w-content px-4 py-16 md:px-6">
      <div className="grid gap-4 md:grid-cols-3">
        {quotes.map(([quote, name]) => (
          <Card key={name}>
            <p className="text-lg leading-8 text-text-primary">&ldquo;{quote}&rdquo;</p>
            <p className="mt-5 text-sm font-semibold text-primary">{name}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}
