import { spawn } from 'child_process';
import path from 'path';

export async function POST(request) {
    const { ip, mascara, subredes } = await request.json();
    console.log('Received mask calculation request:', ip, mascara, subredes);

    try {
        const scriptPath = path.join(process.cwd(), 'mascaras-ips.py');
        console.log('Script path:', scriptPath);

        const result = await new Promise((resolve, reject) => {
            let output = '';
            let errorOutput = '';

            const args = [scriptPath, ip, mascara.toString()];
            if (subredes !== null && subredes !== undefined) {
                args.push(subredes.toString());
            }
            const python = spawn('python', args);

            python.stdout.on('data', (data) => {
                console.log('Python stdout:', data.toString());
                output += data.toString();
            });

            python.stderr.on('data', (data) => {
                console.error('Python stderr:', data.toString());
                errorOutput += data.toString();
            });

            python.on('close', (code) => {
                console.log('Python process exited with code:', code);
                if (code !== 0) {
                    reject(new Error(`Python script failed with code ${code}: ${errorOutput}`));
                } else {
                    resolve(output.trim());
                }
            });

            python.on('error', (err) => {
                console.error('Failed to start Python process:', err);
                reject(err);
            });
        });

        console.log('Final result:', result);
        return Response.json({ success: true, result: result });
    } catch (error) {
        console.error('Error running Python script:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
}