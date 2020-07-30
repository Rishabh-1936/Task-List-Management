//New server with five options and more user interactive
//to use this file just change the path in client.js file at require(./server) to require(./server1.js)

const EventEmitter=require('events')

class Server extends EventEmitter{
        constructor(client){
            super();
            this.tasks={};
            this.taskId=1;

            process.nextTick(()=>{
                this.emit(
                    'response',
                    `WELCOME TO TASK MANAGEMENT \n\nType a command (help to list all the commands)`
                    );
            });
            client.on('command',(command,args)=>{
                switch(command){
                    case 'help':
                    case 'add':
                    case 'ls':
                    case 'delete':
                    case 'exit':
                        this[command](args);
                        break;
                    default:
                        this.emit('response','Unknown command...')
                }
            })
        }
        tasksString(){
            return Object.keys(this.tasks).map((key)=>{
                return `${key} : ${this.tasks[key]}`;
            }).join('\n');
        }
        help(){
            this.emit('response',
            `
            Available Commands:
            --------------------
            1. add task
            2. list
            3. delete : task id
            4. help
            5. exit
            `)
        }
        add(args){
            this.tasks[this.taskId]=args.join(' ');
            this.emit('response',`Added task ${this.taskId}`);
            this.taskId++;
        }
        ls(args){
            this.emit('response',`Tasks:\n${this.tasksString()}`);
        }
        delete(args){
            delete(this.tasks[args[0]])
            this.emit('response',`Deleted task ${args[0]}`)
        }
        exit(){
            let len=Object.keys(this.tasks).length;
            let msg='You have accomplished all tasks.'
            if(len>0){
                msg=`You have accomplished ${(this.taskId-len-1)} tasks`
            }
                delete(this.tasks)
                this.emit('close',msg)
        }
}

module.exports=(client)=> new Server(client); 