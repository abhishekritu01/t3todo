
'use client';

import React, { useState } from "react";
import { api } from "~/trpc/react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { TodoStatus } from "~/server/models/Todo";

const TodoForm: React.FC = () => {
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [dueDate, setDueDate] = useState<string>('');
    const [status, setStatus] = useState<TodoStatus>(TodoStatus.PENDING);
    const [isAdding, setIsAdding] = useState<boolean>(false);

    const addTodo = api.todo.addtodo.useMutation({
        onSuccess: () => {
            toast.success('Todo added successfully', {
                position: "top-right",
                autoClose: 1000,
            });
            setTitle('');
            setDescription('');
            setDueDate('');
            setStatus(TodoStatus.PENDING);
        
        },
        onError: (error) => {
            console.error('Error adding todo:', error);
            toast.error('Failed to add todo', {
                position: "top-right",
                autoClose: 1000,
            });
        }
    });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsAdding(true);

        const todo = {
            title,
            description,
            dueDate: dueDate || undefined,
            status,
        };

        console.log('Adding todo:', todo);

        try {
            await addTodo.mutateAsync(todo);
        } catch (error) {
            console.error('Error adding todo:', error);
        } finally {
            setIsAdding(false);
        }
    };

    return (
        <>
            <div className="p-4 ">
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col items-center  justify-center space-y-4 h-1/2"
                >
                    <input
                        type="text"
                        name="title"
                        placeholder="Add a title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="p-3 border border-gray-600 w-full bg-zinc-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        aria-label="Title"
                        required
                    />
                    <textarea
                        name="description"
                        placeholder="Add a description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="p-3 border border-gray-600 w-full bg-zinc-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        aria-label="Description"
                        required
                    />
                    <input
                        type="date"
                        name="dueDate"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        className="p-3 border border-gray-600 w-full bg-zinc-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        aria-label="Due Date"
                        required
                    />
                    <select
                        name="status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value as TodoStatus)}
                        className="p-3 border border-gray-600 w-full bg-zinc-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        aria-label="Status"
                    >
                        {
                            Object.values(TodoStatus).map((status) => (
                                <option key={status} value={status}>
                                    {status}
                                </option>
                            ))
                        }
                    </select>
                    <button
                        type="submit"
                        disabled={isAdding}
                        className={`bg-zinc-600 w-full text-white p-3 rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${isAdding ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {isAdding ? 'Adding...' : 'Add Todo'}
                    </button>
                </form>
            </div>
        </>
    );
};

export default TodoForm;


