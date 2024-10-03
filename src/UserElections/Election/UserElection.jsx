import React, {useState, useMemo} from 'react';
import Navbar from './Navbar';
import { useLocation } from 'react-router-dom';
import UserLists from './Formula/UserLists';
import ElectionInfo from './Info/ElectionInfo';
import Tables from './Tables/UserTables';
import UserParties from './Parties/UserParties';
import UserVoters from './Voters/UserVoters';
import { ElectionProvider } from './ElectionContext';

const Election = () => {
    const location = useLocation();
    
    // Valores por defecto si no existen en el location.state
    const { 
        title = 'Título no disponible', 
        electionId = null, 
        electionEditable = false 
    } = location.state || {};

    const [activeSection, setActiveSection] = useState('info');
    
    console.log(electionId);

    // Memoiza la sección renderizada para evitar renderizados innecesarios
    const renderSection = useMemo(() => {
        switch (activeSection) {
            case 'parties':
                return <UserParties />;
            case 'lists':
                return <UserLists />;
            case 'tables':
                return <Tables />;
            case 'voters':
                return <UserVoters />;
            case 'info':
            default:
                return <ElectionInfo />;
        }
    }, [activeSection]);

    return (
        <ElectionProvider electionId={electionId} electionEditable={electionEditable}>
            <Navbar setActiveSection={setActiveSection} title={title} />
            <div style={{ marginTop: 'var(--navbar-height)' }}>
                {renderSection}
            </div>
        </ElectionProvider>
    );
};

export default Election;