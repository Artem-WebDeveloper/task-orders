interface StubPageProps {
  title: string;
  description: string;
  stage: number;
}

export function StubPage({ title, description, stage }: StubPageProps) {
  return (
    <div className="rounded-lg border border-dashed p-10">
      <h1 className="text-xl font-semibold">{title}</h1>
      <p className="text-muted-foreground mt-1 text-sm">{description}</p>
      <p className="text-muted-foreground mt-4 text-xs">
        Раздел будет реализован на этапе {stage}
      </p>
    </div>
  );
}
