import "./App.css";
import { useState, useEffect } from "react";

// let InitProjects = Array.from({ length: 10 }, (_, i) => ({
//   id: i + 1,
//   name: `Project ${String.fromCharCode(65 + i)}${
//     i % 2 === 0 ? " Alpha" : " Beta"
//   }`,
//   tasks: Array.from({ length: 5 }, (_, j) => ({
//     id: (i + 1) * 100 + (j + 1),
//     title: `Task ${(i + 1) * 100 + (j + 1)} for Project ${i + 1}`,
//     description: `Description for Task ${(i + 1) * 100 + (j + 1)}`,
//     sub_tasks: Array.from({ length: 10 }, (_, k) => ({
//       id: (i + 1) * 1000 + (j + 1) * 10 + (k + 1),
//       label: `Sub-task ${(i + 1) * 1000 + (j + 1) * 10 + (k + 1)} for Task ${
//         j + 1
//       }`,
//       done: k % 2 === 0, // Alternate between done and not done
//     })),

//     due: `${(i + 1) * 10 + (j + 1)} Aug 20${(i + 1) * 20}`,
//     status: j % 2 === 0 ? "in progress" : j % 3 ? "done" : "todo",
//   })),
// }));

let InitProjects = [];

// console.log(projects);

let selectedProject = {};

function EditTaskPanel({ task, UpdateTask }) {
  const [tasktitle, setTaskTitle] = useState(task.title);
  const [taskDesc, setTaskDesc] = useState(task.description);
  const [taskDue, setTaskDue] = useState(task.due);

  useEffect(() => {
    setTaskTitle(task.title);
    setTaskDesc(task.description);
    setTaskDue(task.due);
  }, [task]);

  return (
    <div className="popup">
      {/* <div className="popup_projectTitle">{projectname}</div> */}
      <div className="popup_taskTitle">
        <span>Task title</span>
        <input
          value={tasktitle}
          onChange={(e) => setTaskTitle(e.target.value)}
        />
      </div>
      <div className="popup_taskDescription">
        <span>Task description</span>
        <input value={taskDesc} onChange={(e) => setTaskDesc(e.target.value)} />
      </div>
      <div className="popup_taskDue">
        <span>Task due</span>
        {/* <input value={taskDue} onChange={(e) => setTaskDesc(e.target.value)} /> */}
        <input
          type="datetime-local"
          value={taskDue}
          min="2018-06-07T00:00"
          max="2025-06-14T00:00"
          onChange={(e) => setTaskDue(e.target.value)}
        />
      </div>
      <button
        className="update_button"
        onClick={() =>
          UpdateTask({
            id: task.id, // Make sure to include the ID here for the update
            title: tasktitle,
            description: taskDesc,
            due: taskDue,
          })
        }
      >
        Update task
      </button>
    </div>
  );
}

function EditSubtaskPanel({ subtaskPackage, UpdateSubTask }) {
  const { taskID, subtask } = subtaskPackage;

  const [subtaskLabel, setSubTaskLabel] = useState(subtask.label);
  const [isDone, setIsDone] = useState(subtask.done);

  function handleUpdateSubtask() {
    console.log(
      `subtask label : ${subtask.label} | subtask is : ${subtask.done}`
    );
    UpdateSubTask(taskID, {
      id: subtask.id,
      label: subtaskLabel,
      done: isDone,
    });

    console.log(`subtask label : ${subtaskLabel} | subtask is : ${isDone}`);
  }

  useEffect(() => {
    setSubTaskLabel(subtask.label);
    setIsDone(subtask.done);
  }, [subtask]);

  return (
    <div className="popup">
      <div className="popup_taskTitle">
        <span>SubTask title</span>
        <input
          value={subtaskLabel}
          onChange={(e) => setSubTaskLabel(e.target.value)}
        />
      </div>
      <div className="popup_taskDone">
        <label>
          <input
            type="checkbox"
            checked={isDone}
            onChange={(e) => setIsDone(e.target.checked)}
          />
          Mark as done
        </label>
      </div>
      <button className="update_button" onClick={() => handleUpdateSubtask()}>
        Update Subtask
      </button>
    </div>
  );
}

function NewProjectPanel({ projects, AddNewProject }) {
  const [projectName, setProjectName] = useState("");

  function handleCreateProject() {
    setProjectName(projectName);
    const Newproject = {
      id: Math.floor(Math.random() * 1000) + 1,
      name: projectName,
      tasks: [],
    };

    projects = [...projects, Newproject];
    AddNewProject(projects);
  }

  return (
    <div className="popup">
      <div className="popup_taskTitle">
        <span>Project title</span>
        <input
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
        />
      </div>

      <button
        className="update_button"
        onClick={() => handleCreateProject(projectName)}
      >
        Create project
      </button>
    </div>
  );
}

function NewSubTaskPanel({
  projects,
  selectedProject,
  selectedTask,
  AddNewSubTask,
}) {
  const [SubTaskLabel, setSubTaskLabel] = useState();

  function handleCreateSubTask() {
    const NewSubTask = {
      id: Math.floor(Math.random() * 1000) + 1,
      label: SubTaskLabel,
      done: false,
    };

    // projects = [...projects, Newtask];
    projects = projects.map((project) => {
      if (project.id === selectedProject) {
        return {
          ...project,
          tasks: project.tasks.map((task) => {
            if (task.id === selectedTask) {
              return {
                ...task,
                sub_tasks: [...task.sub_tasks, NewSubTask], // Append the new task to the tasks array
              };
            }
            return task;
          }),
        };
      }
      return project; // Return the original project if not the selected one
    });

    AddNewSubTask(projects);
  }

  return (
    <div className="popup">
      <div className="popup_taskTitle">
        <span>SubTask label</span>
        <input
          value={SubTaskLabel}
          onChange={(e) => setSubTaskLabel(e.target.value)}
        />
      </div>

      <button className="update_button" onClick={() => handleCreateSubTask()}>
        Create SubTask
      </button>
    </div>
  );
}

function NewTaskPanel({ projects, selectedProject, AddNewTask }) {
  // const [Newtask, setNewtask] = useState();
  const [TaskTitle, setTaskTitle] = useState();
  const [TaskDesc, setTaskDesc] = useState();
  const [TaskDue, setTaskDue] = useState();
  const [TaskStatus, setTaskStatus] = useState();

  function handleCreateTask() {
    const NewTask = {
      id: Math.floor(Math.random() * 1000) + 1,
      title: TaskTitle,
      description: TaskDesc,
      sub_tasks: [],
      due: TaskDue,
      status: TaskStatus,
    };

    // projects = [...projects, Newtask];
    projects = projects.map((project) => {
      if (project.id === selectedProject) {
        return {
          ...project,
          tasks: [...project.tasks, NewTask], // Append the new task to the tasks array
        };
      }
      return project; // Return the original project if not the selected one
    });

    AddNewTask(projects);
  }

  const handleStatusChange = (event) => {
    setTaskStatus(event.target.value);
  };

  return (
    <div className="popup">
      <div className="popup_taskTitle">
        <span>Task title</span>
        <input
          value={TaskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
        />
      </div>
      <div className="popup_taskTitle">
        <span>Task description</span>
        <input value={TaskDesc} onChange={(e) => setTaskDesc(e.target.value)} />
      </div>

      <input
        type="datetime-local"
        value={TaskDue}
        min="2018-06-07T00:00"
        max="2025-06-14T00:00"
        onChange={(e) => setTaskDue(e.target.value)}
      />

      <form>
        <label>
          <input
            type="radio"
            name="status"
            value="todo"
            checked={TaskStatus === "todo"}
            onChange={handleStatusChange}
          />
          To Do
        </label>
        <label>
          <input
            type="radio"
            name="status"
            value="in progress"
            checked={TaskStatus === "in progress"}
            onChange={handleStatusChange}
          />
          In Progress
        </label>
        <label>
          <input
            type="radio"
            name="status"
            value="done"
            checked={TaskStatus === "done"}
            onChange={handleStatusChange}
          />
          Done
        </label>
      </form>

      <button className="update_button" onClick={() => handleCreateTask()}>
        Create Task
      </button>
    </div>
  );
}

function App() {
  const [projects, setProjects] = useState(InitProjects);
  const [curProject, setCurProject] = useState(projects[0]?.id);
  const [todos, setTodos] = useState();
  const [inprogress, setInprogress] = useState();
  const [done, setDone] = useState();
  const [showMenuID, setShowMenuID] = useState(null);
  const [EditTask, setEditTask] = useState(null);
  const [EditSubtask, setEditSubtask] = useState(null);
  const [NewProject, setNewProject] = useState(false);
  const [NewTask, setNewTask] = useState(false);
  const [NewSubTask, setNewSubTask] = useState(null);

  function CreateNewSubTask(NewsubTaskID) {
    setNewSubTask(NewsubTaskID);
  }

  function getSelectedProject(id) {
    setCurProject(id);
    setShowMenuID(null);
  }

  function handleProjectMenu(event, id) {
    event.preventDefault();
    const show = showMenuID === id ? null : id;
    setShowMenuID(show);
  }

  function deleteProject(event, id) {
    event.stopPropagation();
    const remainingProjects = projects.filter((project) => project.id !== id);
    if (curProject === id) setCurProject(projects[0].id);
    setProjects(remainingProjects);
    // console.log("The proejcts are :", projects);
    // console.log("The remaining projects are :", remainingProjects);
    // console.log("The current project is :", curProject);
  }

  function deleteTask(event, taskID) {
    event.stopPropagation(); // Prevent click event from propagating to the project div

    setProjects((prevProjects) => {
      return prevProjects.map((project) => {
        if (project.id === curProject) {
          // Filter out the task with the specified taskID
          const remainingTasks = project.tasks.filter(
            (task) => task.id !== taskID
          );
          // Return the updated project with the remaining tasks
          return { ...project, tasks: remainingTasks };
        }
        return project; // Return unchanged project
      });
    });
  }

  function deleteSubtask(event, taskID, subtaskID) {
    event.stopPropagation(); // Prevent click event from propagating to parent elements

    setProjects((prevProjects) => {
      return prevProjects.map((project) => {
        if (project.id === curProject) {
          // Update the specific project
          return {
            ...project,
            tasks: project.tasks.map((task) => {
              if (task.id === taskID) {
                // Filter out the subtask with the specified subtaskID
                const remainingSubtasks = task.sub_tasks.filter(
                  (subtask) => subtask.id !== subtaskID
                );
                // Return the updated task with the remaining subtasks
                return { ...task, sub_tasks: remainingSubtasks };
              }
              return task; // Return unchanged task
            }),
          };
        }
        return project; // Return unchanged project
      });
    });
  }

  function ToggleEditTask(event, task) {
    event.stopPropagation();
    // alert("You clicked on this");
    setEditTask(task);
  }

  function handleUpdateSubtask(taskID, UpdatedSubtask) {
    setProjects((prevProjects) => {
      return prevProjects.map((project) => {
        if (project.id === curProject) {
          return {
            ...project,
            tasks: project.tasks.map((task) => {
              if (task.id === taskID) {
                return {
                  ...task,
                  sub_tasks: task.sub_tasks.map((subtask) => {
                    if (subtask.id === UpdatedSubtask.id) {
                      return {
                        ...subtask,
                        label: UpdatedSubtask.label,
                        done: UpdatedSubtask.done,
                      };
                    }
                    return subtask;
                  }),
                };
              }
              return task;
            }),
          };
        }
        return project;
      });
    });
    console.log("Subtask updated");
  }

  function ToggleEditSubTask(event, taskID, subtask) {
    event.stopPropagation();
    setEditSubtask({ taskID, subtask });
  }

  function handleUpdateTask(UpdatedTask) {
    setProjects((prevProjects) => {
      return prevProjects.map((project) => {
        if (project.id === curProject) {
          // Update the specific project
          return {
            ...project,
            tasks: project.tasks.map((task) => {
              if (task.id === UpdatedTask.id) {
                // Return the updated task with the remaining subtasks
                return {
                  ...task,
                  title: UpdatedTask.title,
                  description: UpdatedTask.description,
                  due: UpdatedTask.due,
                };
              }
              return task; // Return unchanged task
            }),
          };
        }
        return project; // Return unchanged project
      });
    });

    console.log("Project task updated");
  }

  function handleCreateNewProject() {
    setNewProject(true);
  }

  function handleNewTask() {
    setNewTask(!NewTask);
  }

  useEffect(() => {
    console.log(EditSubtask);
  }, [EditSubtask]);

  // Log the current project ID whenever it changes
  useEffect(() => {
    console.log("Is the ID of the current project:", curProject);
    selectedProject = projects.find((project) => project.id === curProject);
    const tasks = selectedProject?.tasks || []; // Fallback to an empty array if tasks is undefined

    const todos = tasks?.filter((task) => task.status === "todo") || [];
    const inprogress =
      tasks?.filter((task) => task.status === "in progress") || [];
    const done = tasks?.filter((task) => task.status === "done") || [];

    setTodos(todos);
    setInprogress(inprogress);
    setDone(done);
    console.log(selectedProject);
    console.log("Todos :", todos);
    console.log("inProgress :", inprogress);
    console.log("done :", done);
  }, [curProject, projects]);

  return (
    <div className="App">
      <div className="Project_container">
        <div className="Projects_list">
          <h1>Projects List</h1>
          <div className="Projects">
            {true &&
              projects?.map((project) => (
                <Project
                  key={project.id}
                  project={project}
                  curProject={curProject}
                  showMenuID={showMenuID}
                  handleProjectMenu={(event) =>
                    handleProjectMenu(event, project.id)
                  }
                  updateSelected={getSelectedProject}
                  handledeleteProject={deleteProject}
                />
              ))}
          </div>
          <button className="AddProject" onClick={handleCreateNewProject}>
            New project
          </button>
        </div>
        <div className="Search_kanban">
          <div className="Search_Task">
            <input type="text" placeholder="Search specific task" />
          </div>
          <div className="Kanban_view">
            {true && (
              <>
                <CardList
                  tasks={todos}
                  status={"Todo"}
                  handleDeleteTask={deleteTask}
                  handleDeleteSubTask={deleteSubtask}
                  handleEditTask={ToggleEditTask}
                  handleEditSubtask={ToggleEditSubTask}
                  handleUpdateSubtask={handleUpdateSubtask}
                  handleNewTask={handleNewTask}
                  CreateNewSubTask={CreateNewSubTask}
                />
                <CardList
                  tasks={inprogress}
                  status={"In Progress"}
                  handleDeleteTask={deleteTask}
                  handleDeleteSubTask={deleteSubtask}
                  handleEditTask={ToggleEditTask}
                  handleEditSubtask={ToggleEditSubTask}
                  handleUpdateSubtask={handleUpdateSubtask}
                  handleNewTask={handleNewTask}
                  CreateNewSubTask={CreateNewSubTask}
                />
                <CardList
                  tasks={done}
                  status={"Done"}
                  handleDeleteTask={deleteTask}
                  handleDeleteSubTask={deleteSubtask}
                  handleEditTask={ToggleEditTask}
                  handleEditSubtask={ToggleEditSubTask}
                  handleUpdateSubtask={handleUpdateSubtask}
                  handleNewTask={handleNewTask}
                  CreateNewSubTask={CreateNewSubTask}
                />
              </>
            )}
          </div>
        </div>
        <div className="SidePanel">
          {EditTask && (
            <EditTaskPanel task={EditTask} UpdateTask={handleUpdateTask} />
          )}
          {EditSubtask && (
            <EditSubtaskPanel
              subtaskPackage={EditSubtask}
              UpdateSubTask={handleUpdateSubtask}
            />
          )}
          {NewProject && (
            <NewProjectPanel projects={projects} AddNewProject={setProjects} />
          )}
          {NewTask && (
            <NewTaskPanel
              projects={projects}
              selectedProject={curProject}
              AddNewTask={setProjects}
            />
          )}
          {NewSubTask && (
            <NewSubTaskPanel
              projects={projects}
              selectedProject={curProject}
              selectedTask={NewSubTask}
              AddNewSubTask={setProjects}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function Project({
  project,
  curProject,
  updateSelected,
  showMenuID,
  handleProjectMenu,
  handledeleteProject,
}) {
  const styling = {
    backgroundColor: "rgba(255, 235, 201, 0.9)",
  };

  return (
    <div
      style={curProject === project.id ? styling : {}}
      className="project"
      onClick={() => updateSelected(project.id)}
      onContextMenu={(event) => handleProjectMenu(event, project.id)}
    >
      <span>🖿</span>
      <p>{project.name}</p>
      <small>{project.tasks.length} tasks</small>
      {showMenuID === project.id && (
        <p className="Project_menu">
          <button
            className="deleteProject"
            onClick={(event) => handledeleteProject(event, project.id)}
          >
            Delete
          </button>
        </p>
      )}
    </div>
  );
}

function CardList({
  tasks,
  status,
  handleDeleteTask,
  handleDeleteSubTask,
  handleEditTask,
  handleEditSubtask,
  handleUpdateSubtask,
  handleNewTask,
  CreateNewSubTask,
}) {
  return (
    <div className="Cards_list">
      <div className="Card_list_header">
        <p>
          {status} ({tasks?.length})
        </p>
        <button className="btn add" onClick={() => handleNewTask()}>
          <span>✚</span> <p>Add new tasks</p>
        </button>
      </div>
      {true &&
        tasks?.map((task) => (
          <Card
            task={task}
            key={task.id}
            handleDeleteTask={handleDeleteTask}
            handleDeleteSubTask={handleDeleteSubTask}
            handleEditTask={handleEditTask}
            handleEditSubtask={handleEditSubtask}
            handleUpdateSubtask={handleUpdateSubtask}
            CreateNewSubTask={CreateNewSubTask}
          />
        ))}
    </div>
  );
}

function Card({
  task,
  handleDeleteTask,
  handleDeleteSubTask,
  handleEditTask,
  handleEditSubtask,
  handleUpdateSubtask,
  CreateNewSubTask,
}) {
  const [showTasks, setShowTasks] = useState(false);

  // Calculate the progress percentage
  const completedSubTasks = task.sub_tasks.filter(
    (subtask) => subtask.done
  ).length;
  const totalSubTasks = task.sub_tasks.length;
  const progressPercentage =
    totalSubTasks === 0 ? 0 : (completedSubTasks / totalSubTasks) * 100; // Avoid division by zero

  function handleShowTasks() {
    setShowTasks((showTasks) => !showTasks);
  }

  return (
    <div className="Card" onClick={handleShowTasks} draggable="true">
      <div
        className="Edit_Card"
        onClick={(event) => handleEditTask(event, task)}
      >
        ✎
      </div>
      <h2 className="Title">{task.title}</h2>
      <h5 className="description">{task.description}</h5>
      <div className="Progress">
        <div className="Progress_status">
          <small className="progress_title">progress</small>
          <small className="progress_number">
            {task.sub_tasks.filter((task) => task.done === true).length}/
            {task.sub_tasks.length}
          </small>
        </div>
        <div className="progress_bar">
          <div
            className="current_progress"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>
      <div className="Card_Tasks">
        {showTasks &&
          task.sub_tasks.map((subtask) => (
            <Task
              key={subtask.id}
              subtask={subtask}
              taskID={task.id}
              handleDeleteSubTask={handleDeleteSubTask}
              handleEditSubtask={handleEditSubtask}
              handleUpdateSubtask={handleUpdateSubtask}
            />
          ))}
      </div>
      <div className="Status">
        <div className="DueDate">{task.due}</div>
        <button className="AddTask" onClick={() => CreateNewSubTask(task.id)}>
          New
        </button>
        <button
          className="deleteTask"
          onClick={(event) => handleDeleteTask(event, task.id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

function Task({
  subtask,
  handleDeleteSubTask,
  taskID,
  handleEditSubtask,
  handleUpdateSubtask,
}) {
  function handleUpdatechecked(event, toggle) {
    event.stopPropagation();
    handleUpdateSubtask(taskID, { ...subtask, done: toggle });
  }
  return (
    <div className="Task_x">
      <input
        type="checkbox"
        checked={subtask.done}
        onClick={(event) => handleUpdatechecked(event, !subtask.done)}
      ></input>
      <p className="TaskLabel">{subtask.label}</p>
      <button
        className="btn edit"
        onClick={(event) => handleEditSubtask(event, taskID, subtask)}
      >
        Edit
      </button>
      <button
        className="btn delete"
        onClick={(event) => handleDeleteSubTask(event, taskID, subtask.id)}
      >
        ✕
      </button>
    </div>
  );
}

export default App;
