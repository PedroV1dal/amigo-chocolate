import { useState } from "react";
import { UserPlus, Check, ArrowRight, AlertCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import ParticipantList from "./ParticipantList";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface RegistrationScreenProps {
  participants: string[];
  onAdd: (name: string) => boolean;
  onEdit: (index: number, newName: string) => boolean;
  onDelete: (index: number) => void;
  onFinalize: () => boolean;
  onCancel: () => void;
}

const RegistrationScreen = ({
  participants,
  onAdd,
  onEdit,
  onDelete,
  onFinalize,
  onCancel,
}: RegistrationScreenProps) => {
  const [inputName, setInputName] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleSave = () => {
    if (!inputName.trim()) {
      toast({
        title: "Nome inválido",
        description: "Por favor, digite um nome válido.",
        variant: "destructive",
      });
      return;
    }

    if (editingIndex !== null) {
      const success = onEdit(editingIndex, inputName);
      if (success) {
        toast({
          title: "Nome atualizado! ✏️",
          description: `${inputName} foi editado com sucesso.`,
        });
        setEditingIndex(null);
        setInputName("");
      } else {
        toast({
          title: "Erro ao editar",
          description: "Este nome já existe na lista.",
          variant: "destructive",
        });
      }
    } else {
      const success = onAdd(inputName);
      if (success) {
        toast({
          title: "Participante adicionado! 🎉",
          description: `${inputName} entrou no amigo chocolate.`,
        });
        setInputName("");
      } else {
        toast({
          title: "Erro ao adicionar",
          description: "Este nome já existe na lista.",
          variant: "destructive",
        });
      }
    }
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setInputName(participants[index]);
  };

  const handleDelete = (index: number) => {
    const name = participants[index];
    onDelete(index);
    toast({
      title: "Participante removido",
      description: `${name} foi removido da lista.`,
    });
  };

  const handleFinalize = () => {
    if (participants.length < 3) {
      toast({
        title: "Participantes insuficientes",
        description: "Você precisa de pelo menos 3 pessoas para o sorteio.",
        variant: "destructive",
      });
      return;
    }
    setShowConfirmDialog(true);
  };

  const confirmFinalize = () => {
    const success = onFinalize();
    if (success) {
      toast({
        title: "Cadastro finalizado! 🎄",
        description: "Vamos começar o sorteio!",
      });
    }
    setShowConfirmDialog(false);
  };

  const canFinalize = participants.length >= 3;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 relative z-10">
      {/* Cancel Button - Fixed at top right */}
      <div className="fixed top-4 right-4 z-50">
        <Button
          onClick={onCancel}
          variant="outline"
          className="bg-destructive/10 border-destructive/30 text-destructive hover:bg-destructive hover:text-destructive-foreground"
        >
          <X className="mr-2 h-4 w-4" />
          Cancelar
        </Button>
      </div>

      <div className="w-full max-w-lg animate-fade-in">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-2">
            Cadastro de <span className="text-accent">Participantes</span>
          </h2>
          <p className="text-muted-foreground">
            Adicione todos os participantes do amigo chocolate
          </p>
        </div>

        {/* Form Card */}
        <div className="glass-card p-6 mb-6">
          <div className="flex gap-3 mb-4">
            <Input
              placeholder="Digite o nome do participante"
              value={inputName}
              onChange={(e) => setInputName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
              className="flex-1 bg-input/50 border-border/50 text-foreground placeholder:text-muted-foreground"
            />
          </div>

          <div className="flex gap-3 flex-wrap">
            <Button onClick={handleSave} className="flex-1 min-w-[140px] bg-primary hover:bg-primary/90">
              <Check className="mr-2 h-4 w-4" />
              {editingIndex !== null ? "Atualizar" : "Salvar Nome"}
            </Button>
            <Button
              onClick={() => {
                setInputName("");
                setEditingIndex(null);
              }}
              variant="outline"
              className="flex-1 min-w-[140px] border-border/50 hover:bg-muted"
            >
              <UserPlus className="mr-2 h-4 w-4" />
              {editingIndex !== null ? "Cancelar" : "Limpar"}
            </Button>
          </div>
        </div>

        {/* Participants List */}
        <div className="glass-card p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">
              Participantes ({participants.length})
            </h3>
            {!canFinalize && (
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                Mínimo 3
              </span>
            )}
          </div>
          <ParticipantList
            participants={participants}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>

        {/* Finalize Button */}
        <Button
          onClick={handleFinalize}
          disabled={!canFinalize}
          className={`w-full py-6 text-lg ${
            canFinalize 
              ? "btn-gold" 
              : "bg-muted text-muted-foreground cursor-not-allowed"
          }`}
        >
          Finalizar Cadastro
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">
              Confirmar finalização?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Você está prestes a finalizar o cadastro com {participants.length} participantes.
              Após confirmar, não será possível adicionar ou remover pessoas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-border hover:bg-muted">
              Voltar
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmFinalize} className="bg-primary hover:bg-primary/90">
              Confirmar e Sortear
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default RegistrationScreen;
