import style from './Category.module.css';

interface CategoryProps {
    id: string;
    name: string;
    active?: boolean;
    onClick?: () => void;
}

export const Category: React.FC<CategoryProps> = ({ id, name, active = false, onClick }) => {
    return (
        <div className={`relative w-full max-w-55 p-6 border-2 border-gray-400 flex items-center justify-center rounded-full ${active ? style.active : ""}`} onClick={onClick}>
            <h2 className="category-name">{name}</h2>
        </div>
    );
}