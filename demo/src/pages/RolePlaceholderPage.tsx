import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { roleCopy, type RoleDef } from '../app/roles';
import { t } from '../strings';

/** Stand-in for role views that later build phases replace. */
export function RolePlaceholderPage({ role }: { role: RoleDef }) {
  const navigate = useNavigate();
  const copy = roleCopy(role.id);
  const Icon = role.icon;
  return (
    <div className="mx-auto max-w-[1440px] px-6 py-12 lg:px-12">
      <Card className="flex flex-col items-center px-8 py-16 text-center">
        <div className="mb-5 flex size-16 items-center justify-center rounded-full bg-mint text-secondary">
          <Icon className="size-7" />
        </div>
        <Badge tone="blue" className="mb-3">
          {t.placeholder.phase(role.phase)}
        </Badge>
        <h1 className="mb-2 text-headline-md text-navy">{copy.title}</h1>
        <p className="mb-1 max-w-lg text-body-md text-on-surface-variant">{copy.description}</p>
        <p className="mb-8 text-body-sm text-muted">{t.placeholder.body}</p>
        <Button variant="tertiary" onClick={() => navigate('/')} iconLeft={<ArrowLeft className="size-4" />}>
          {t.placeholder.back}
        </Button>
      </Card>
    </div>
  );
}
