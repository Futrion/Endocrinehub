export function RoleBadge({ role }) {
    if (!role) return null;
    const isAdmin = role === 'admin';
    return (
        <span
            className={`inline-block mt-1 text-xs font-medium px-2 py-0.5 rounded-full ${
                isAdmin ? 'bg-secondary text-info' : 'bg-tertiary text-primary'
            }`}
        >
            {isAdmin ? 'Administrador' : 'Usuario'}
        </span>
    );
}
