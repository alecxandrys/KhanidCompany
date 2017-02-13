/**
 * Require priority queue. If it don't work, run 'meteor npm install js-priority-queue'
 * @see https://github.com/adamhooper/js-priority-queue
 * @type {{pointA: {}, pointB: {}, BS: {}, Result: {success: boolean, message: string, route: null}, FindPath: PathFinder.FindPath}}
 */
PathFinder={

    Result:{
        success:false,
        message:'',
        route:[],
        cost:0
    },
    /**
     * 1-Grass
     * 2-Cover
     * 3-Diff
     * 4-Danger
     * 5-Ruin
     * 0-Unreached
     * -1-Offset
     * @param x1
     * @param y1
     * @param x2
     * @param y2
     * @param BS
     * @constructor
     */
    FindPath:function(x1,y1,x2,y2,BS)
    {

        var PriorityQueue=require('js-priority-queue');
        var pointA=new Cell(x1,y1,BS.map[x1][y1].ground);
        var pointB=new Cell(x2,y2,BS.map[x2][y2].ground);
        if(BS.map[x1][y1].ground == 0 || BS.map[x1][y1] == -1)
        {
            this.Result.success=false;
            this.Result.message='Start point Unreached/Offset';
            return this.Result;
        }
        if(BS.map[x2][y2].ground == 0 || BS.map[x2][y2].ground == -1)
        {
            this.Result.success=false;
            this.Result.message='Final point Unreached/Offset';
            return this.Result;
        }
        var frontier=new PriorityQueue({comparator:function(a,b) { return b.cost-a.cost; }});
        var cameFrom={};
        var costSoFar={};

        cameFrom[pointA.toString()]=new Cell(-1,-1,-1);
        costSoFar[pointA.toString()]=0;
        pointA.cost=0;
        frontier.queue(pointA);

        var current;

        while(frontier.length>0)
        {
            current=frontier.dequeue();
            if(current == pointB)
            {
                //this.Result.success=true;
                this.Result.message='Path was found success';
                break;
            }

            var neighbors=this.Neighbors(current,BS);
            neighbors.forEach(function(next)
            {
                var newCost=costSoFar[current.toString()]+Cost(current,next);
                if(!costSoFar.hasOwnProperty(next.toString()) || newCost<costSoFar[next.toString()])
                {
                    costSoFar[next.toString()]=newCost;
                    next.cost=newCost+Heuristic(pointB,next);
                    frontier.queue(next);
                    cameFrom[next.toString()]=current;
                }
            })
        }
        //write a path
        this.Result.cost=current.cost;
        current=pointB;
        this.Result.route.push(current);
        while(current != pointA)
        {
            current=cameFrom[current.toString()];
            this.Result.route.push(current);
        }
        this.Result.success=true;
        return this.Result;
    },
    Neighbors:function(cell,BS)
    {
        var neighbors=[];
        var trying;
        var x=cell.x;
        var y=cell.y;

        this.Shifts.forEach(function(shift)//kill context
        {
            if (!(x+shift.x>=BS.xSize) && !(x+shift.x<0) && !(y+shift.y>=BS.ySize) && !(x+shift.x<0))
            {
                trying=BS.map[x+shift.x][y+shift.y];

                if(trying != undefined && trying != null && trying.ground != -1)
                {
                    neighbors.push(new Cell(trying.x,trying.y,trying.ground));
                }
            }
        });
        return neighbors;
    },
    Shifts:[{x:-1,y:0},{x:-1,y:1},{x:0,y:-1},{x:0,y:1},{x:1,y:0},{x:1,y:-1}]

};
function Cell(x,y,ground)
{
    this.toString=function()
    {
        return this.x+'_'+this.y;
    }

    this.x=x;
    this.y=y;
    this.ground=ground;
    this.cost=0;
    return this;
};
function Cost(current,next)
{
    switch(next.ground)
    {
        case 1:
        {
            return 1;
        }//grass
        case 2:
        {
            return 2;
        }//cover
        case 3:
        {
            return 4;
        }//diff
        case 4:
        {
            return 6;
        }//danger
        case 5:
        {
            return 3;
        }//ruin
        default:
        {
            return 1000;
        }
    }
};
function Heuristic(a,b)
{
    return Math.abs(a.x-b.x)+Math.abs(a.y-b.y);
};