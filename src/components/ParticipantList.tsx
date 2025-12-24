import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ParticipantListProps {
  participants: string[];
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
  disabled?: boolean;
}

const ParticipantList = ({ participants, onEdit, onDelete, disabled }: ParticipantListProps) => {
  if (participants.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p className="text-lg">Nenhum participante cadastrado ainda</p>
        <p className="text-sm mt-2">Adicione pelo menos 3 pessoas para começar!</p>
      </div>
    );
  }

  return (
    <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
      {participants.map((name, index) => (
        <div
          key={index}
          className="flex items-center justify-between bg-muted/50 rounded-lg px-4 py-3 animate-fade-in"
          style={{ animationDelay: `${index * 0.05}s` }}
        >
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-semibold text-primary">
              {index + 1}
            </span>
            <span className="font-medium">{name}</span>
          </div>
          
          {!disabled && (
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(index)}
                className="h-8 w-8 text-muted-foreground hover:text-accent"
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(index)}
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ParticipantList;
