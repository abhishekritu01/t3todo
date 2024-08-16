'use client';
import React, { useState, useEffect } from 'react';
import { format, parseISO, isValid, fromUnixTime } from 'date-fns';
import { api } from "~/trpc/react";
import { PencilIcon, TrashIcon } from '@heroicons/react/20/solid';
import { toast } from 'react-toastify';
import { TodoStatus } from '~/server/models/Todo';



interface Todo {
    id: number;
    title: string;
    description: string;
    dueDate?: string;
    completed: boolean;
    status: TodoStatus;
}


const AllTodo: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
    const [updateData, setUpdateData] = useState({
        title: '',
        description: '',
        dueDate: '',
        completed: false, 
        status: TodoStatus.PENDING
    });


    const { data: todos, error, refetch } = api.todo.gettodos.useQuery();


    const { mutate: deleteTodo } = api.todo.deletetodo.useMutation({
        onSuccess: () => {
            refetch();
            toast.success('Todo deleted successfully', { position: "top-center", autoClose: 1000 });
        },
        onError: (error) => {
            console.error('Error deleting todo:', error);
            toast.error('Failed to delete todo', { position: "top-center" });
        }
    });

    const { mutate: updateTodo } = api.todo.updatetodo.useMutation({
        onSuccess: () => {
            refetch();
            setEditingTodo(null);
            toast.success('Todo updated successfully', { position: "top-center", autoClose: 1000 });
        },
        onError: (error) => {
            console.error('Error updating todo:', error);
            toast.error('Failed to update todo', { position: "top-center" });
        }
    });

    useEffect(() => {
        if (editingTodo) {
            setUpdateData({
                title: editingTodo.title,
                description: editingTodo.description,
                dueDate: editingTodo.dueDate || '',
                completed: editingTodo.completed,
                status: editingTodo.status
            });
        }
    }, [editingTodo]);

    if (!todos) {
        return <p className='text-white'>Loading...</p>;
    }

    if (error) {
        return <p className="text-red-500">Failed to load todos.</p>;
    }
    

    const todoList = Array.isArray(todos) ? todos : (todos?.rows || []);

    const filteredTodos = todoList.filter((todo) =>
        todo.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = async (id: number) => {
        setLoading(true);
        await deleteTodo({ id });
        setLoading(false);
    }

    const handleUpdate = async () => {
        if (editingTodo) {
            console.log('Updating Todo with:', updateData); // Debugging line
            setLoading(true);
            try {
                await updateTodo({
                    id: editingTodo.id,
                    title: updateData.title,
                    description: updateData.description,
                    dueDate: updateData.dueDate,
                    completed: !!updateData.completed, // Ensure this is a boolean
                    status: updateData.status
                });
            } catch (error) {
                console.error('Error updating todo:', error);
            } finally {
                setLoading(false);
            }
        }
    }

    const formatDate = (date?: number | string) => {
        if (typeof date === 'number') {
            const parsedDate = fromUnixTime(date);
            return isValid(parsedDate) ? format(parsedDate, 'yyyy-MM-dd') : 'Invalid Date';
        } else if (typeof date === 'string') {
            const parsedDate = parseISO(date);
            return isValid(parsedDate) ? format(parsedDate, 'yyyy-MM-dd') : 'Invalid Date';
        }
        return 'No Date';
    };

    console.log('todos:', todos); // Debugging line

    return (
        <div className="bg-zinc-900 min-h-screen text-gray-200 p-6">
            <div className="flex justify-between items-center mb-6 shadow p-1">
                <button
                    onClick={() => refetch()}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                >
                    Refresh
                </button>
            
                <div className="flex space-x-4 items-center">
                    <p className="text-xs">Total :  {todos.rows.length}</p>
                </div>
            </div>

            <input
                type="text"
                placeholder="Search Todos"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="p-3 mb-4 border border-gray-600 w-full bg-zinc-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Search Todos"
            />

            <div className="max-w-3xl mx-auto h-[calc(100vh-6rem)] overflow-y-auto">
                {filteredTodos.length === 0 ? (
                    <p className="text-center text-gray-400">No todos available</p>
                ) : (
                    <div className="space-y-4">
                        {filteredTodos.map((todo) => (
                            <div
                                key={todo.id}
                                className={`relative p-6 rounded-lg shadow-lg border border-gray-600 ${todo.completed ? 'bg-gray-800' : 'bg-gray-700'
                                    }`}
                            >
                                {loading && (
                                    <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center">
                                        <div className="spinner"></div>
                                    </div>
                                )}
                                <div className="absolute top-2 right-2 flex space-x-2">
                                    <button
                                        onClick={() => setEditingTodo(todo)}
                                        className="p-2 bg-blue-500 rounded-full hover:bg-blue-600 transition"
                                        aria-label="Edit Todo"
                                    >
                                        <PencilIcon className="h-5 w-5 text-white" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(todo.id)}
                                        className="p-2 bg-red-500 rounded-full hover:bg-red-600 transition"
                                        aria-label="Delete Todo"
                                    >
                                        <TrashIcon className="h-5 w-5 text-white" />
                                    </button>
                                </div>
                                <h2 className="text-xl font-bold mb-1">{todo.title}</h2>
                                <p className="text-gray-300 mb-2">{todo.description}</p>
                                {todo.dueDate && (
                                    <p className="text-gray-400 mb-2">Due: {formatDate(todo.dueDate)}</p>
                                )}
                                {todo.created_at && (
                                    <p className="text-gray-00 mb-2">Created: {formatDate(todo.created_at)}</p>
                                )}
                                <p
                                    className={`text-sm font-semibold ${todo.completed ? 'text-green-400' : 'text-red-400'
                                        }`}
                                >
                                    {todo.completed ? 'Completed' : 'Not Completed'}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {editingTodo && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-2xl font-bold mb-4">Edit Todo</h2>
                        <input
                            type="text"
                            value={updateData.title}
                            onChange={(e) => setUpdateData({ ...updateData, title: e.target.value })}
                            className="p-2 mb-4 w-full border border-gray-600 bg-gray-700 text-white rounded-lg"
                            placeholder="Title"
                        />
                        <textarea
                            value={updateData.description}
                            onChange={(e) => setUpdateData({ ...updateData, description: e.target.value })}
                            className="p-2 mb-4 w-full border border-gray-600 bg-gray-700 text-white rounded-lg"
                            placeholder="Description"
                        />
                        <input
                            type="date"
                            value={updateData.dueDate}
                            onChange={(e) => setUpdateData({ ...updateData, dueDate: e.target.value })}
                            className="p-2 mb-4 w-full border border-gray-600 bg-gray-700 text-white rounded-lg"
                        />
                        <div className="flex items-center mb-4">
                            <input
                                type="checkbox"
                                checked={updateData.completed}
                                onChange={(e) => setUpdateData({ ...updateData, completed: e.target.checked })}
                                className="mr-2"
                            />
                            <label className="text-gray-300">Completed</label>
                        </div>
                        <select
                            value={updateData.status}
                            onChange={(e) => setUpdateData({ ...updateData, status: e.target.value as TodoStatus })}
                            className="p-2 mb-4 w-full border border-gray-600 bg-gray-700 text-white rounded-lg"
                        >
                            {Object.values(TodoStatus).map((status) => (
                                <option key={status} value={status}>
                                    {status}
                                </option>
                            ))}
                        </select>
                        <div className="flex justify-end">
                            <button
                                onClick={() => setEditingTodo(null)}
                                className="bg-gray-600 text-white px-4 py-2 rounded-lg mr-2"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdate}
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                            >
                                {loading ? 'Updating...' : 'Update'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AllTodo;





