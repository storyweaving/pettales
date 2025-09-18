import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { MilestoneData } from '../../types';

const SectionHeader: React.FC<{ number: number; title: string; }> = ({ number, title }) => (
    <div className="flex items-center space-x-3 pt-4 pb-2">
        <div className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-gray-200 dark:bg-gray-600 text-sm font-bold text-gray-700 dark:text-gray-300">
            {number}
        </div>
        <h3 className="text-md font-semibold text-gray-800 dark:text-gray-200">{title}</h3>
    </div>
);

const FormInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
    <input {...props} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600" />
);

const FormSelect: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = ({ children, ...props }) => (
    <select {...props} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600">
        {children}
    </select>
);

const FormTextarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (props) => (
    <textarea {...props} rows={3} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600" />
);

const FormLabel: React.FC<{ htmlFor: string; children: React.ReactNode; sublabel?: string }> = ({ htmlFor, children, sublabel }) => (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {children}
        {sublabel && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{sublabel}</p>}
    </label>
);

const MilestonesForm: React.FC = () => {
  const { state, dispatch, saveMilestones } = useAppContext();
  const [localMilestones, setLocalMilestones] = useState<MilestoneData>(state.milestones);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setLocalMilestones({ ...localMilestones, [e.target.name]: e.target.value });
  };

  const handleClose = () => {
    dispatch({ type: 'SET_COCKPIT_VIEW', payload: null });
  }

  const handleSave = async () => {
    await saveMilestones(localMilestones);
    handleClose();
  };

  return (
    <div className="p-6 h-full flex flex-col bg-white dark:bg-gray-800">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Pet Profile</h2>
            <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
        <div className="flex-grow flex flex-col min-h-0">
            <form className="space-y-4 overflow-y-auto flex-grow pr-2">
                <SectionHeader number={1} title="About Your Pet" />
                <div>
                    <FormLabel htmlFor="pet_type">What type of pet is this story about?</FormLabel>
                    <FormSelect id="pet_type" name="pet_type" value={localMilestones.pet_type} onChange={handleChange}>
                        <option value="">Select...</option>
                        <option>Dog</option>
                        <option>Cat</option>
                        <option>Horse</option>
                        <option>Bird</option>
                        <option>Reptile</option>
                        <option>Small Mammal (e.g., Rabbit, Hamster)</option>
                        <option value="Other">Other</option>
                    </FormSelect>
                </div>
                 {localMilestones.pet_type === 'Other' && (
                    <div>
                        <FormLabel htmlFor="pet_type_other">Please specify the type of pet:</FormLabel>
                        <FormInput type="text" name="pet_type_other" id="pet_type_other" value={localMilestones.pet_type_other} onChange={handleChange} />
                    </div>
                )}
                <div>
                    <FormLabel htmlFor="name">What is your pet's name?</FormLabel>
                    <FormInput type="text" name="name" id="name" value={localMilestones.name} onChange={handleChange} />
                </div>
                 <div>
                    <FormLabel htmlFor="breed">What breed are they?</FormLabel>
                    <FormInput type="text" name="breed" id="breed" value={localMilestones.breed} onChange={handleChange} placeholder="e.g., Golden Retriever, Mixed, Tabby Cat" />
                </div>
                <div>
                    <FormLabel htmlFor="sex">What is their sex?</FormLabel>
                    <FormSelect id="sex" name="sex" value={localMilestones.sex} onChange={handleChange}>
                        <option value="">Select...</option>
                        <option value="female">Female</option>
                        <option value="male">Male</option>
                    </FormSelect>
                </div>
                
                <SectionHeader number={2} title="History & Appearance" />
                 <div>
                    <FormLabel htmlFor="dob">When were they born? (Approximate Date)</FormLabel>
                    <FormInput type="date" name="dob" id="dob" value={localMilestones.dob} onChange={handleChange} />
                </div>
                <div>
                    <FormLabel htmlFor="gotcha_date">What was their "Gotcha Day"? (Date of Adoption)</FormLabel>
                    <FormInput type="date" name="gotcha_date" id="gotcha_date" value={localMilestones.gotcha_date} onChange={handleChange} />
                </div>
                <div>
                    <FormLabel htmlFor="appearance" sublabel="e.g., Fluffy orange cat with white paws; Large brindle dog with one floppy ear.">Describe their appearance (color, markings, size, etc.).</FormLabel>
                    <FormTextarea name="appearance" id="appearance" value={localMilestones.appearance || ''} onChange={handleChange} />
                </div>
                
                <SectionHeader number={3} title="Personality & Favorites" />
                 <div>
                    <FormLabel htmlFor="personality" sublabel="e.g., Loves to cuddle, is afraid of thunderstorms, steals socks, purrs loudly.">What are their unique personality traits and quirks?</FormLabel>
                    <FormTextarea name="personality" id="personality" value={localMilestones.personality || ''} onChange={handleChange} />
                </div>
                 <div>
                    <FormLabel htmlFor="favorite_things">What are some of their favorite things (toys, foods, activities)?</FormLabel>
                    <FormTextarea name="favorite_things" id="favorite_things" value={localMilestones.favorite_things || ''} onChange={handleChange} />
                </div>

                <SectionHeader number={4} title="Relationships & Memories" />
                <div>
                    <FormLabel htmlFor="relationship_to_owner">How would you describe your relationship with them?</FormLabel>
                    <FormInput type="text" name="relationship_to_owner" id="relationship_to_owner" value={localMilestones.relationship_to_owner} onChange={handleChange} placeholder="e.g., My loyal companion, the family goofball" />
                </div>
                <div>
                    <FormLabel htmlFor="significant_memories" sublabel="These provide rich context for memorable time references.">Share some favorite memories or important places (like the dog park, a cozy nap spot).</FormLabel>
                    <FormTextarea name="significant_memories" id="significant_memories" value={localMilestones.significant_memories || ''} onChange={handleChange} />
                </div>
                <div>
                    <FormLabel htmlFor="hopes_and_aspirations" sublabel="This gives the AI a deeper understanding of the story's underlying emotional goals.">What are your hopes, dreams, or wishes for them as expressed in this story?</FormLabel>
                    <FormTextarea name="hopes_and_aspirations" id="hopes_and_aspirations" value={localMilestones.hopes_and_aspirations || ''} onChange={handleChange} />
                </div>
            </form>
            <div className="mt-6 flex-shrink-0">
                <button
                    type="button"
                    onClick={handleSave}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                >
                    Save Pet Profile
                </button>
            </div>
        </div>
    </div>
  );
};

export default MilestonesForm;