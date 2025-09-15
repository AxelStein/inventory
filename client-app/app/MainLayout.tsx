import { useContext, useEffect, useState } from "react";
import { Button, Dropdown, DropdownButton, SplitButton } from "react-bootstrap";
import { Link, Outlet, useLocation, useNavigate } from "react-router";
import { DarkModeSwitch } from 'react-toggle-dark-mode';
import classNames from 'classnames';
import { useDispatch, useSelector } from "react-redux";
import { useSignOutMutation } from "api/auth/auth.api";
import { logout } from "api/slice/auth.slice";
import AppToastContainer from "./components/AppToastContainer";
import { toast } from 'react-toastify';
import { useErrorFormatter } from "./components/error.formatter";
import { useTranslation } from "react-i18next";
import { useGetAppConfigQuery } from "api/app/app.api";
import ReactFlagsSelect from "react-flags-select";
import type { AppLanguage } from "api/app/app.types";
import { useSaveUserSettingsMutation } from "api/user/user.api";
import { MdHelp, MdHelpCenter, MdHelpOutline } from "react-icons/md";
import { InventoryContext } from "./inventory/InventoryPage";
import CreateSupportTicketModal from "./CreateSupportTicketModal";

export default function MainLayout() {
    const { t, i18n } = useTranslation();
    const [isDarkMode, setDarkMode] = useState(localStorage.getItem('theme') === 'dark');
    const [locale, setLocale] = useState<string | null>(localStorage.getItem('locale') ?? i18n.language);
    const user = useSelector((state: any) => state.auth.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [signOut] = useSignOutMutation();
    const { formatError } = useErrorFormatter();
    const { data: appConfig } = useGetAppConfigQuery();
    const [saveUserSettings] = useSaveUserSettingsMutation();
    const [showCreateSupportTicket, setShowCreateSupportTicket] = useState(false);

    useEffect(() => {
        i18n.changeLanguage(locale ?? undefined);
        if (locale) {
            localStorage.setItem('locale', locale);
        }
        saveUserSettings({ locale: locale || undefined });
    }, [locale]);

    useEffect(() => {
        const themeName = isDarkMode ? 'dark' : 'light';
        document.documentElement.setAttribute('data-bs-theme', themeName);
        localStorage.setItem('theme', themeName);
        saveUserSettings({ theme: themeName });
    }, [isDarkMode]);

    useEffect(() => {
        setDarkMode(localStorage.getItem('theme') === 'dark');
        setLocale(localStorage.getItem('locale'));
    }, [user]);

    const handleUserClick = () => {
        navigate('/user/own');
    }

    const handleSignOutClick = () => {
        signOut().unwrap()
            .then(() => {
                dispatch(logout());
                navigate('/');
            })
            .catch(err => toast.error(formatError(err)));
    }

    const LanguageSelector = () => {
        const langs = appConfig?.languages;
        if (!langs) return null;

        const labels = langs.reduce((acc, lang) => {
            acc[lang.flag] = lang.name;
            return acc;
        }, {} as any);

        const handleSelectLang = (value: string) => {
            const lang = langs.find(lang => lang.flag === value);
            if (lang) {
                setLocale(lang.locale);
            }
        }

        const selectedFlag = langs.find(lang => lang.locale === locale)?.flag ?? 'US';

        return <ReactFlagsSelect
            fullWidth={false}
            countries={langs.map(lang => lang.flag)}
            customLabels={labels}
            selected={selectedFlag}
            onSelect={handleSelectLang}
            placeholder={<span />}
            showSelectedLabel={false}
            selectButtonClassName="main-lang-selector-btn"
            className="main-lang-selector" />
    }

    const handleSupportClick = () => {
        setShowCreateSupportTicket(true);
    }

    const handleHideCreateSupportTicket = () => {
        setShowCreateSupportTicket(false);
    }

    return <div>
        <div className={classNames('app-bar', { 'app-bar-dark': isDarkMode })}>
            <Link
                to='/'
                replace={true}
                className="app-bar-title-link">
                <h5 className='app-bar-title'>Inventory App</h5>
            </Link>

            <div className="main-layout-actions">
                <div
                    className="me-2"
                    onClick={handleSupportClick}>
                    <MdHelpOutline size='24px' />
                </div>

                <LanguageSelector />

                <DarkModeSwitch
                    className="me-3"
                    checked={isDarkMode}
                    onChange={setDarkMode}
                />

                {user != null ? (
                    <SplitButton
                        onClick={handleUserClick}
                        title={<span className="app-bar-username">{user.name}</span>}
                        variant='outline-primary'>
                        <Dropdown.Item onClick={handleSignOutClick}>Sign out</Dropdown.Item>
                    </SplitButton>
                ) : (
                    <Link to="/auth/sign-in">{t('auth.btnSignIn')}</Link>
                )}
            </div>
        </div>
        <div className="p-3">
            <Outlet />
            <AppToastContainer />
        </div>

        <CreateSupportTicketModal
            show={showCreateSupportTicket}
            onHide={handleHideCreateSupportTicket} />
    </div>
}