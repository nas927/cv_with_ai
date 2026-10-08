import type { Profile } from '../types/cv';

interface HeaderProps {
    profile: Profile;
}

export function Header({ profile }: HeaderProps) {
    return (
        <header className="topbar">
            <div className="brand">
                <span className="brand-mark">✳</span>
                <span>
                    makefolio<span className="brand-dot">.</span>ai
                </span>
            </div>
            <div className="topbar-right">
                <span className="connection">
                    <i /> Groq ready
                </span>
                <div className="avatar">{profile.initials}</div>
            </div>
        </header>
    );
}
