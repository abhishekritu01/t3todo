import React from "react";
import Link from "next/link";
import { api } from "~/trpc/server";
import Header from "~/app/_components/Header";
import AllTodo from "./_components/AllTodo";
import TodoForm from "./_components/TodoForm";



const Home: React.FC = async () => {

  return (
    <>
    <Header />
    <section className="container mx-auto py-6 px-4 sm:py-8 sm:px-6 lg:py-10 lg:px-8">
      <div className="flex flex-col lg:flex-row">
  
        <div className="flex-1 bg-zinc-800 p-6 h-auto rounded-lg shadow-lg mb-4 lg:mb-0 lg:mr-4">
          <h2 className="text-xl font-bold mb-4 text-center text-gray-200">Add a Todo</h2>
          <TodoForm />
        </div>
        
        <div className="flex-1 bg-zinc-800 p-6 rounded-lg shadow-lg lg:ml-4">
          <h2 className="text-xl font-bold mb-4 text-gray-200">All Todos</h2>
          <AllTodo />
        </div>
  
      </div>
    </section>
  </>
  
  );
};

export default Home;












