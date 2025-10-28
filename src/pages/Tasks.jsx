import { useToolbar } from "../store/toolbar";
export default function Tasks() {
  useToolbar({
    title: "Tasks",
    searchPlaceholder: "Search tasks by keyword, status…",
    backButton: true,  
  });
  return <div className="card">Tasks board…</div>;
}
