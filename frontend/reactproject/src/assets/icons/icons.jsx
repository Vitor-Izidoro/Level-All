// src/assets/icons/icons.jsx
import {
  IoPerson,
  IoPeople,
  IoHome,
  IoPricetag,
  IoCog,
  IoChatbubblesSharp,
  IoNotifications,
  IoPaperPlane,
  IoPersonAdd,
  IoPencil,
  IoShieldCheckmark,
  IoSearch,
  IoTrashBin,
  IoImage,
} from "react-icons/io5";

const iconMap = {
  perfil: IoPerson,
  comunidade: IoPeople,
  pagina: IoHome,
  tags: IoPricetag,
  configuracoes: IoCog,
  mensagens: IoChatbubblesSharp,
  notificacoes: IoNotifications,
  enviar: IoPaperPlane,
  seguir: IoPersonAdd,
  editar: IoPencil,
  autenticacao: IoShieldCheckmark,
  pesquisar: IoSearch,
  excluir: IoTrashBin,
  imagem: IoImage,
};

export default function Icon({ nome, size = 20, color = "inherit", ...props }) {
  if (!nome || typeof nome !== "string") return null;

  const IconComponent = iconMap[nome.toLowerCase()];
  if (!IconComponent) {
    console.warn(`Ícone "${nome}" não encontrado.`);
    return (
      <span
        style={{
          display: "inline-block",
          width: size,
          height: size,
          color,
          opacity: 0.4,
        }}
      >
        ?
      </span>
    );
  }

  return <IconComponent size={size} color={color} {...props} />; // ✅ JSX retornado
}
