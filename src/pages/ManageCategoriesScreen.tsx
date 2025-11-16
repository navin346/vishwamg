import React, { useState } from 'react';
import { useAppContext } from '@/src/context/AppContext';

interface ModalProps {
    onClose: () => void;
}

const ManageCategoriesScreen: React.FC<ModalProps> = ({ onClose }) => {
    const { categories, addCategory, editCategory, deleteCategory } = useAppContext();
    const [newCategory, setNewCategory] = useState('');
    const [editingCategory, setEditingCategory] = useState<{ oldName: string; newName: string } | null>(null);

    const handleAdd = () => {
        if (newCategory.trim()) {
            addCategory(newCategory.trim());
            setNewCategory('');
        }
    };
    
    const handleSaveEdit = () => {
        if (editingCategory) {
            editCategory(editingCategory.oldName, editingCategory.newName.trim());
            setEditingCategory(null);
        }
    }

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end justify-center">
            <div className="w-full max-w-md h-[90vh] bg-white dark:bg-slate-900 rounded-t-2xl shadow-xl flex flex-col animate-slide-up">
                <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-slate-800">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Manage Categories</h2>
                    <button onClick={onClose} className="text-gray-500 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full p-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                
                <div className="flex-grow p-4 overflow-y-auto space-y-2">
                    {categories.map(cat => (
                        <div key={cat} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-slate-800 rounded-lg">
                            {editingCategory?.oldName === cat ? (
                                <input 
                                    type="text"
                                    value={editingCategory.newName}
                                    onChange={(e) => setEditingCategory({ ...editingCategory, newName: e.target.value })}
                                    className="flex-grow bg-transparent focus:outline-none text-gray-900 dark:text-white"
                                />
                            ) : (
                                <span className="text-gray-900 dark:text-white">{cat}</span>
                            )}
                            <div className="flex items-center gap-2">
                               {editingCategory?.oldName === cat ? (
                                    <button onClick={handleSaveEdit} className="text-green-500 hover:text-green-700">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                    </button>
                               ) : (
                                     <button onClick={() => setEditingCategory({ oldName: cat, newName: cat })} className="text-blue-500 hover:text-blue-700">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" /></svg>
                                    </button>
                               )}
                                <button onClick={() => deleteCategory(cat)} className="text-red-500 hover:text-red-700">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="p-4 border-t border-gray-200 dark:border-slate-800 flex gap-2">
                    <input
                        type="text"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        placeholder="Add new category"
                        className="w-full px-3 py-2 bg-gray-100 dark:bg-neutral-800 border border-gray-300 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-violet-500 text-gray-900 dark:text-white"
                    />
                    <button
                        onClick={handleAdd}
                        className="bg-violet-600 hover:bg-violet-700 text-white font-bold py-2 px-4 rounded-lg"
                    >
                        Add
                    </button>
                </div>
            </div>
            <style>{`
                @keyframes slide-up {
                    from { transform: translateY(100%); }
                    to { transform: translateY(0); }
                }
                .animate-slide-up {
                    animation: slide-up 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default ManageCategoriesScreen;