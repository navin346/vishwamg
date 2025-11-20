import React, { useState } from 'react';
import { useAppContext } from '@/src/context/AppContext';
import { X, Check, Plus, Trash2, Edit2 } from 'lucide-react';

interface ModalProps {
    onClose: () => void;
}

const ManageCategoriesScreen: React.FC<ModalProps> = ({ onClose }) => {
    const { categories, addCategory, editCategory, deleteCategory } = useAppContext();
    const [newCategory, setNewCategory] = useState('');
    const [editingCategory, setEditingCategory] = useState<{ oldName: string; newName: string } | null>(null);
    const [isAdding, setIsAdding] = useState(false);

    const handleAdd = async () => {
        if (newCategory.trim()) {
            setIsAdding(true);
            // Small delay to simulate network feedback visually
            await new Promise(r => setTimeout(r, 300)); 
            addCategory(newCategory.trim());
            setNewCategory('');
            setIsAdding(false);
        }
    };
    
    const handleSaveEdit = () => {
        if (editingCategory) {
            editCategory(editingCategory.oldName, editingCategory.newName.trim());
            setEditingCategory(null);
        }
    }

    const handleDelete = (cat: string) => {
        if(confirm(`Are you sure you want to delete "${cat}"?`)) {
            deleteCategory(cat);
        }
    }

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end justify-center">
            <div className="w-full max-w-md h-[85vh] bg-white dark:bg-slate-900 rounded-t-3xl shadow-2xl flex flex-col animate-slide-up border-t border-gray-100 dark:border-slate-800">
                <div className="flex justify-between items-center p-5 border-b border-gray-100 dark:border-slate-800">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">Manage Categories</h2>
                    <button onClick={onClose} className="bg-gray-100 dark:bg-neutral-800 p-2 rounded-full text-gray-500 dark:text-neutral-400 hover:bg-gray-200 dark:hover:bg-neutral-700 transition-colors">
                        <X size={20} />
                    </button>
                </div>
                
                <div className="flex-grow p-4 overflow-y-auto space-y-3">
                    {categories.map(cat => (
                        <div key={cat} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-slate-800/50 rounded-2xl border border-gray-100 dark:border-slate-800">
                            {editingCategory?.oldName === cat ? (
                                <input 
                                    type="text"
                                    autoFocus
                                    value={editingCategory.newName}
                                    onChange={(e) => setEditingCategory({ ...editingCategory, newName: e.target.value })}
                                    className="flex-grow bg-white dark:bg-slate-800 px-2 py-1 rounded-md focus:outline-none ring-2 ring-violet-500 text-gray-900 dark:text-white"
                                    onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit()}
                                />
                            ) : (
                                <span className="text-gray-900 dark:text-white font-medium ml-1">{cat}</span>
                            )}
                            
                            <div className="flex items-center gap-2">
                               {editingCategory?.oldName === cat ? (
                                    <button onClick={handleSaveEdit} className="p-2 bg-green-100 text-green-600 rounded-full hover:bg-green-200">
                                        <Check size={16} />
                                    </button>
                               ) : (
                                     <button onClick={() => setEditingCategory({ oldName: cat, newName: cat })} className="p-2 text-gray-400 hover:text-violet-600 hover:bg-violet-50 rounded-full transition-colors">
                                        <Edit2 size={16} />
                                    </button>
                               )}
                                <button onClick={() => handleDelete(cat)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                    
                    {categories.length === 0 && <p className="text-center text-gray-400 py-10">No categories found.</p>}
                </div>

                <div className="p-5 bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 pb-8">
                    <div className="flex gap-3">
                        <input
                            type="text"
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            placeholder="New category name..."
                            className="w-full px-4 py-3 bg-gray-100 dark:bg-neutral-800 border border-transparent focus:bg-white focus:border-violet-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-100 text-gray-900 dark:text-white transition-all"
                            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                        />
                        <button
                            onClick={handleAdd}
                            disabled={!newCategory.trim() || isAdding}
                            className="bg-violet-600 hover:bg-violet-700 disabled:bg-gray-300 text-white font-bold p-3 rounded-xl transition-colors flex-shrink-0 w-12 flex items-center justify-center"
                        >
                            {isAdding ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Plus size={24} />}
                        </button>
                    </div>
                </div>
            </div>
            <style>{`
                @keyframes slide-up {
                    from { transform: translateY(100%); }
                    to { transform: translateY(0); }
                }
                .animate-slide-up {
                    animation: slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
            `}</style>
        </div>
    );
};

export default ManageCategoriesScreen;