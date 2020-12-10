import chalk from "chalk";
import fs from "fs";
import ncp from "ncp";
import path from "path";
import { promisify } from "util";
import Listr from 'listr';
import { projectInstall } from 'pkg-install';
import 
{
    initGit,
    mapToTemplates,
    editPackageJSON,
    checkPath
} from "./utils";

const access = promisify( fs.access );
const copy = promisify( ncp );

async function copyTemplateFiles ( options ) 
{
    return copy( options.templateDirectory, options.targetDirectory,
        {
            clobber: false
        } );
}

async function createProject ( options )
{

    const config =
    {
        name: options[ "project-name" ],
        template: options[ "template" ],
        manager: options[ "package-manager" ],
        git: options.git,
        pkg: options.pkg,
        install: options.install,

    };

    let templateDirectory;

    if ( options[ 'template-path' ] )
    {
        templateDirectory = options[ 'template-path' ];
    }
    else
    {
        /* Get address to templates directory in the root of this project*/

        templateDirectory = path.resolve( __dirname,
            "../templates",
            mapToTemplates[ config.template ] );
    }


    const CURR_DIR = process.cwd();

    config.templateDirectory = templateDirectory;
    config.targetDirectory = `${ CURR_DIR }/${ config.name }`;

    /*Check if we can access the templates folder */
    try 
    {
        await access( templateDirectory, fs.constants.R_OK );
    }
    catch ( error ) 
    {
        console.error( `${ chalk.red.bold( "ERROR" ) }  Invalid template name` );

        process.exit( 1 );
    }

    //Confiure our task list

    const tasks = new Listr(
        [
            {
                title: 'Copy template files',
                task: () => copyTemplateFiles( config ),
            },
            {
                title: 'Initialize git',
                task: () => initGit( config ),
                enabled: () => config.git,
            },
            {
                title: 'Update package.json',
                task: () => editPackageJSON( config ),
                enabled: () => config.template !== "basic",
            },
            {
                title: 'Install dependencies',
                task: () =>
                {
                    return projectInstall( {
                        cwd: config.targetDirectory,
                        prefer: config.manager,
                    } );
                },
                skip: () =>
                {
                    if ( !config.install )
                    {
                        return "No dependencies will be installed";
                    }
                }
            },
        ] );

    await tasks.run();

    console.log( `${ chalk.green.bold( "DONE" ) }. Project ready` );

    return true;


}



export default createProject;
