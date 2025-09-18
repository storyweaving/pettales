import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import MilestonesForm from '../cockpit/MilestonesForm';
import ChapterList from '../cockpit/ChapterList';
import SettingsView from '../cockpit/MenuView';
import PicturesView from '../cockpit/PicturesView';
import { jsPDF } from 'jspdf';
import { CockpitView, ToastType } from '../../types';
import Auth from '../auth/Auth';
import PetPortraitBuilderView from '../cockpit/BabyCardBuilderView';
import ShareTaleView from '../cockpit/ShareTaleView';

const MainMenuView: React.FC = () => {
    const { state, dispatch } = useAppContext();
    const { chapters } = state;
    const [isDownloading, setIsDownloading] = useState(false);

    const handleClose = () => {
        dispatch({ type: 'SET_COCKPIT_VIEW', payload: null });
    }

    const handleCopyEmail = () => {
        navigator.clipboard.writeText('support@pettalesai.com');
        dispatch({ type: 'ADD_TOAST', payload: { message: 'Email copied to clipboard!', type: ToastType.Success } });
    };

    const handleDownload = async () => {
        if (isDownloading) return;
        setIsDownloading(true);
        dispatch({ type: 'ADD_TOAST', payload: { message: 'Preparing your PDF...', type: ToastType.Info } });
        
        const storyContainer = document.createElement('div');

        try {
            const doc = new jsPDF({
                orientation: 'p',
                unit: 'pt',
                format: 'a4'
            });

            // Make the container invisible but part of the layout for robust rendering
            storyContainer.style.position = 'absolute';
            storyContainer.style.top = '0';
            storyContainer.style.left = '0';
            storyContainer.style.zIndex = '-1';
            storyContainer.style.opacity = '0.01';
            storyContainer.style.pointerEvents = 'none';
            storyContainer.style.width = `${doc.internal.pageSize.getWidth() - 80}pt`;
            storyContainer.style.fontFamily = 'Times, serif';
            storyContainer.style.fontSize = '12pt';
            storyContainer.style.lineHeight = '1.5';
            storyContainer.style.color = '#000';
            
            let fullHtmlContent = '';
            for (const [index, chapter] of chapters.entries()) {
                const title = `Chapter ${index + 1}${chapter.name ? `: ${chapter.name}` : ''}`;
                fullHtmlContent += `<h2 style="font-size: 16pt; font-family: Helvetica, sans-serif; font-weight: bold; margin-bottom: 10pt; margin-top: ${index > 0 ? '40pt' : '20pt'};">${title}</h2>`;

                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = chapter.content;

                const images = tempDiv.querySelectorAll('img');
                images.forEach(img => {
                    img.style.maxWidth = '250px';
                    img.style.height = 'auto';
                    img.style.display = 'block';
                    img.style.margin = '1rem 0 1rem auto';
                    img.style.borderRadius = '0.5rem';
                    img.style.boxShadow = 'none';
                });
                
                fullHtmlContent += `<div>${tempDiv.innerHTML}</div>`;
            }
            
            storyContainer.innerHTML = fullHtmlContent;
            document.body.appendChild(storyContainer);

            // Wait for all images inside the container to fully load
            const images = Array.from(storyContainer.querySelectorAll('img'));
            const imageLoadPromises = images.map(img => new Promise((resolve, reject) => {
                if (img.complete) {
                    resolve(true);
                } else {
                    img.onload = resolve;
                    img.onerror = reject;
                }
            }));
            
            await Promise.all(imageLoadPromises);

            // Generate the PDF using a robust callback approach
            await new Promise<void>((resolve, reject) => {
                try {
                    doc.html(storyContainer, {
                        margin: [40, 40, 40, 40],
                        autoPaging: 'slice',
                        html2canvas: {
                            scale: 0.75,
                            useCORS: true,
                        },
                        callback: function(pdfDoc) {
                            try {
                                pdfDoc.save('PetTales.pdf');
                                resolve();
                            } catch (saveError) {
                                reject(saveError);
                            }
                        }
                    });
                } catch (htmlError) {
                    reject(htmlError);
                }
            });
            
            dispatch({ type: 'ADD_TOAST', payload: { message: 'Story downloaded as PDF.', type: ToastType.Success } });

        } catch (error: any) {
            console.error('Failed to generate PDF:', error);
            dispatch({ type: 'ADD_TOAST', payload: { message: `Could not generate PDF: ${error.message || 'An unknown error occurred.'}`, type: ToastType.Error } });
        } finally {
            if (document.body.contains(storyContainer)) {
                document.body.removeChild(storyContainer);
            }
            setIsDownloading(false);
        }
    };


    return (
        <div className="p-6 h-full flex flex-col bg-white dark:bg-gray-800">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Menu</h2>
                <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            <div className="flex-grow flex flex-col">
                <ul className="space-y-4 text-gray-700 dark:text-gray-300">
                    <li className="bg-gray-100 dark:bg-gray-700/50 p-3 rounded-lg">
                        <button 
                            onClick={() => dispatch({ type: 'SET_COCKPIT_VIEW', payload: 'pet-portrait-builder' })} 
                            className="w-full flex items-center justify-center space-x-2 font-medium transition-colors hover:text-orange-600 dark:hover:text-orange-400"
                            aria-label="Create Your Pet Portrait"
                        >
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                            </svg>
                            <span>Create Pet Portrait</span>
                        </button>
                    </li>
                    <li className="bg-gray-100 dark:bg-gray-700/50 p-3 rounded-lg">
                        <button 
                            onClick={() => dispatch({ type: 'SET_COCKPIT_VIEW', payload: 'share-tale' })} 
                            className="w-full flex items-center justify-center space-x-2 font-medium transition-colors hover:text-orange-600 dark:hover:text-orange-400"
                            aria-label="Share Short Tale"
                        >
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                            </svg>
                            <span>Share Short Tale</span>
                        </button>
                    </li>
                    <li className="bg-gray-100 dark:bg-gray-700/50 p-3 rounded-lg">
                        <button 
                            onClick={handleDownload} 
                            disabled={isDownloading}
                            className="w-full flex items-center justify-center space-x-2 font-medium transition-colors hover:text-orange-600 dark:hover:text-orange-400 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isDownloading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span>Downloading...</span>
                                </>
                            ) : (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                    <span>Download Story as PDF</span>
                                </>
                            )}
                        </button>
                    </li>
                    <li className="bg-gray-100 dark:bg-gray-700/50 p-3 rounded-lg">
                        <button 
                            onClick={handleCopyEmail} 
                            className="w-full flex items-center justify-center space-x-2 font-medium transition-colors hover:text-orange-600 dark:hover:text-orange-400"
                            aria-label="Copy support email to clipboard"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                            <span>support@pettalesai.com</span>
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    );
}

const MobileMenuView: React.FC = () => {
    const { dispatch } = useAppContext();

    const handleClose = () => {
        dispatch({ type: 'SET_COCKPIT_VIEW', payload: null });
    }

    const handleNavigate = (view: CockpitView) => {
        dispatch({ type: 'SET_COCKPIT_VIEW', payload: view });
    }

    const menuItems = [
        { label: 'Pet Profile', view: 'milestones' as CockpitView, icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18V15M10 18V12M14 18V9M18 18V6" /></svg> },
        { label: 'Chapters', view: 'chapters' as CockpitView, icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg> },
        { label: 'Pictures', view: 'pictures' as CockpitView, icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg> },
        { label: 'Menu', view: 'menu' as CockpitView, icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" /></svg> },
    ];

    return (
        <div className="p-6 h-full flex flex-col bg-white dark:bg-gray-800">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Navigation</h2>
                <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            <div className="flex-grow flex flex-col">
                <ul className="space-y-4 text-gray-700 dark:text-gray-300">
                    {menuItems.map((item) => (
                        <li key={item.view}>
                            <button
                                onClick={() => handleNavigate(item.view)}
                                className="w-full flex items-center space-x-3 bg-gray-100 dark:bg-gray-700/50 p-3 rounded-lg font-medium transition-colors hover:text-orange-600 dark:hover:text-orange-400"
                            >
                                {item.icon}
                                <span>{item.label}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

const EmptyCockpitView: React.FC = () => {
  return (
    <div className="p-6 h-full flex flex-col items-center justify-center text-center bg-white dark:bg-gray-800">
      <div className="p-5 bg-orange-100 dark:bg-orange-900/30 rounded-full mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-orange-500 dark:text-orange-400" viewBox="0 0 20 20" fill="currentColor">
            <path d="M9.522 1.954a.75.75 0 01.956 0 15.65 15.65 0 013.322 2.375c.958.822 1.75 1.77 2.38 2.822a.75.75 0 01-.868 1.056 14.15 14.15 0 00-2.222-2.558 14.238 14.238 0 00-2.823-2.14.75.75 0 01-.743-.55z" />
            <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zM3.44 6.422A5.992 5.992 0 015.65 4.35l.063.048a.75.75 0 01-.914 1.198 4.492 4.492 0 00-1.29 1.488.75.75 0 01-1.238-.762zM5.558 8.583a.75.75 0 01.67 1.018 2.5 2.5 0 00-2.217 2.217.75.75 0 01-1.018-.67 4 4 0 013.565-3.565zM11.75 10a1.75 1.75 0 10-3.5 0 1.75 1.75 0 003.5 0zM14.442 11.417a.75.75 0 11.67 1.018 4 4 0 01-3.565 3.565.75.75 0 11-.67-1.018 2.5 2.5 0 002.217-2.217.75.75 0 011.348-.348z" clipRule="evenodd" />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-800 dark:text-white">Story Controls</h3>
      <p className="text-sm mt-1 text-gray-500 dark:text-gray-400">Click a button in the navigation bar to get started.</p>
    </div>
  );
};

const GlassCockpit: React.FC = () => {
    const { state, dispatch } = useAppContext();
    const { cockpitView } = state;

    const isVisibleOnMobile = !!cockpitView;

    const handleClose = () => {
        dispatch({ type: 'SET_COCKPIT_VIEW', payload: null });
    };

  const renderContent = () => {
    switch (cockpitView) {
      case 'milestones':
        return <MilestonesForm />;
      case 'chapters':
        return <ChapterList />;
      case 'pictures':
        return <PicturesView />;
      case 'settings':
        return <SettingsView />;
      case 'menu':
        return <MainMenuView />;
      case 'pet-portrait-builder':
        return <PetPortraitBuilderView />;
      case 'share-tale':
        return <ShareTaleView />;
      case 'mobile-menu':
        return <MobileMenuView />;
      case 'auth':
        return <Auth />;
      default:
        if (state.isLoading) return null;
        if (state.session) return <EmptyCockpitView />;
        return null;
    }
  };

  return (
      <>
        {/* Backdrop for mobile view */}
        <div
            role="button"
            tabIndex={0}
            aria-label="Close menu"
            className={`fixed inset-0 bg-black/60 z-30 transition-opacity duration-300 md:hidden ${isVisibleOnMobile ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            onClick={handleClose}
            onKeyDown={(e) => e.key === 'Enter' && handleClose()}
        ></div>

        <aside className={`
            flex-shrink-0 bg-gray-100/50 dark:bg-gray-800/70
            w-full min-w-[320px] overflow-hidden
            fixed top-0 right-0 h-full z-40
            transition-transform duration-300 ease-in-out
            ${isVisibleOnMobile ? 'translate-x-0' : 'translate-x-full'}
            md:relative md:w-1/3 lg:w-1/4 md:translate-x-0 md:border-l md:border-gray-200 md:dark:border-gray-700
        `}>
        <div className="h-full flex flex-col">
            {renderContent()}
        </div>
        </aside>
    </>
  );
};

export default GlassCockpit;