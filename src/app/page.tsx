import TaskList from "@/components/TaskList";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen p-8 pt-12 pb-20 sm:p-12 font-[family-name:var(--font-geist-sans)]">
      <header className="max-w-4xl mx-auto mb-10 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800 dark:text-white">
          Task Manager
        </h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          A complete CRUD application built with Next.js and MongoDB
        </p>
      </header>
      
      <main>
        <TaskList />
      </main>
      
      <footer className="max-w-4xl mx-auto mt-16 pt-8 border-t border-gray-200 dark:border-gray-700 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4 text-gray-600 dark:text-gray-400"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn Next.js
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4 text-gray-600 dark:text-gray-400"
          href="https://www.mongodb.com/docs/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          MongoDB Docs
        </a>
      </footer>
    </div>
  );
}
