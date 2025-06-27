import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ApiService } from './api.service';
import { Assignment, AssignmentSubmission } from '../models/api.models';

@Injectable({
  providedIn: 'root'
})
export class AssignmentService extends ApiService {

  // GET /assignments/{id} - Get assignment by ID
  getAssignmentById(assignmentId: string): Observable<Assignment> {
    // Simulate API call with fake data
    const mockAssignments: { [key: string]: Assignment } = {
      'assign_001': {
        id: 'assign_001',
        title: 'Devoir 1 - Classes et Objets',
        description: 'Premier devoir sur les concepts de base de la programmation orientée objet. Créez une classe représentant un véhicule avec ses propriétés et méthodes principales (démarrer, arrêter, accélérer). Incluez au moins 3 attributs et 3 méthodes.',
        due_date: '2025-02-15T23:59:59Z',
        max_score: 20,
        course_id: '1',
        created_by: '3',
        created_date: '2025-01-28T09:00:00Z'
      },
      'assign_002': {
        id: 'assign_002',
        title: 'Projet Final - Application Web Complète',
        description: 'Développez une application web complète utilisant Angular et TypeScript. L\'application doit inclure : gestion d\'utilisateurs, interface responsive, gestion de fichiers, et au moins 5 pages fonctionnelles. Le projet doit démontrer votre maîtrise des concepts avancés de développement web moderne.',
        due_date: '2027-06-30T23:59:59Z',
        max_score: 100,
        course_id: '1',
        created_by: '3',
        created_date: '2025-06-27T10:00:00Z'
      },
      'assign_003': {
        id: 'assign_003',
        title: 'TP3 - Analyse de Base de Données',
        description: 'Analysez le schéma de base de données fourni et créez un rapport détaillé. Votre rapport doit inclure : une analyse des relations entre les tables, l\'identification des clés primaires et étrangères, des suggestions d\'optimisation, et des requêtes SQL exemples. Format PDF requis, 5-10 pages.',
        due_date: '2025-07-05T23:59:59Z',
        max_score: 30,
        course_id: '1',
        created_by: '3',
        created_date: '2025-06-27T11:00:00Z'
      },
      'assign_004': {
        id: 'assign_004',
        title: 'Test Empty - Nouveau Devoir',
        description: 'Devoir de test pour vérifier les soumissions vides. Créez un document simple avec votre nom et votre compréhension des concepts vus en cours. Ce devoir n\'a encore aucune soumission.',
        due_date: '2025-07-15T23:59:59Z',
        max_score: 25,
        course_id: '1',
        created_by: '3',
        created_date: '2025-06-27T14:00:00Z'
      }
    };

    const assignment = mockAssignments[assignmentId] || {
      id: assignmentId,
      title: 'Devoir inconnu',
      description: 'Description non disponible',
      due_date: new Date().toISOString(),
      max_score: 100,
      course_id: '1',
      created_by: '1',
      created_date: new Date().toISOString()
    };

    console.log('Fetching assignment:', assignmentId);
    return of(assignment);
    // Real API call would be: return this.get<Assignment>(`/assignments/${assignmentId}`);
  }

  // GET /assignments/{id}/submissions - Get submissions for assignment
  getAssignmentSubmissions(assignmentId: string): Observable<AssignmentSubmission[]> {
    // For the new test assignment, return empty submissions
    if (assignmentId === 'assign_004') {
      return of([]);
    }

    // Mock data for development
    const mockSubmissions: AssignmentSubmission[] = [
      {
        id: 'sub_001',
        assignment_id: assignmentId,
        student_id: '1', // Jean Dupont (student)
        file_id: 4,
        submitted_date: '2025-02-10T14:30:00Z',
        status: 'submitted'
      },
      {
        id: 'sub_002',
        assignment_id: assignmentId,
        student_id: '5', // Additional student for demo
        file_id: 5,
        submitted_date: '2025-02-12T16:45:00Z',
        score: 18,
        feedback: 'Excellent travail, bien structuré. Très bonne compréhension des concepts.',
        status: 'graded'
      },
      {
        id: 'sub_003',
        assignment_id: assignmentId,
        student_id: '6', // Additional student for demo
        file_id: 6,
        submitted_date: '2025-02-14T10:15:00Z',
        score: 15,
        feedback: 'Bon travail dans l\'ensemble. Quelques points à améliorer sur la documentation.',
        status: 'graded'
      },
      {
        id: 'sub_004',
        assignment_id: assignmentId,
        student_id: '7', // Additional student for demo
        file_id: 7,
        submitted_date: '2025-02-13T20:30:00Z',
        status: 'submitted'
      },
      {
        id: 'sub_005',
        assignment_id: assignmentId,
        student_id: '8', // Additional student for demo
        file_id: 8,
        submitted_date: '2025-02-16T09:15:00Z', // After deadline
        status: 'late'
      },
      {
        id: 'sub_006',
        assignment_id: assignmentId,
        student_id: '9', // Additional student for demo
        file_id: 9,
        submitted_date: '2025-02-17T14:20:00Z', // After deadline
        score: 12,
        feedback: 'Travail rendu en retard. Contenu correct mais pénalité appliquée.',
        status: 'late'
      }
    ];

    return of(mockSubmissions);
    // Real implementation: return this.get<AssignmentSubmission[]>(`/assignments/${assignmentId}/submissions`);
  }

  // POST /assignments/{id}/submissions - Submit assignment
  submitAssignment(assignmentId: string, fileId: number): Observable<AssignmentSubmission> {
    // Get assignment to check due date
    return this.getAssignmentById(assignmentId).pipe(
      switchMap((assignment: Assignment) => {
        const now = new Date();
        const dueDate = new Date(assignment.due_date);
        const isLate = now > dueDate;

        // Mock response for development
        const newSubmission: AssignmentSubmission = {
          id: 'sub_' + Date.now(),
          assignment_id: assignmentId,
          student_id: '1', // Jean Dupont (student from auth service)
          file_id: fileId,
          submitted_date: new Date().toISOString(),
          status: isLate ? 'late' : 'submitted'
        };

        console.log('Submitting assignment:', assignmentId, 'with file:', fileId, 'Status:', newSubmission.status);
        return of(newSubmission);
        // Real implementation: return this.post<AssignmentSubmission>(`/assignments/${assignmentId}/submissions`, { file_id: fileId });
      })
    );
  }

  // GET /assignments/{id}/submissions/me - Get current user's submission
  getMySubmission(assignmentId: string): Observable<AssignmentSubmission | null> {
    console.log('Getting my submission for assignment:', assignmentId);
    
    // Mock different scenarios for testing
    if (assignmentId === 'assign_001') {
      // Scenario 1: Graded submission with feedback
      const gradedSubmission: AssignmentSubmission = {
        id: 'sub_student_001',
        assignment_id: assignmentId,
        student_id: '1', // Jean Dupont (student from auth service)
        file_id: 101,
        submitted_date: '2025-02-14T16:30:00Z',
        status: 'graded',
        score: 19,
        feedback: 'Excellent travail ! Votre analyse est très bien structurée et vos arguments sont solides. Quelques petites améliorations possibles sur la conclusion.'
      };
      return of(gradedSubmission);
    } else if (assignmentId === 'assign_002') {
      // Scenario 2: Late submission, not yet graded
      const lateSubmission: AssignmentSubmission = {
        id: 'sub_student_002',
        assignment_id: assignmentId,
        student_id: '1', // Jean Dupont (student from auth service)
        file_id: 102,
        submitted_date: '2025-06-16T10:15:00Z', // After deadline
        status: 'late'
      };
      return of(lateSubmission);
    } else if (assignmentId === 'assign_003') {
      // Scenario 3: Submitted on time, waiting for grading
      const submittedSubmission: AssignmentSubmission = {
        id: 'sub_student_003',
        assignment_id: assignmentId,
        student_id: '1', // Jean Dupont (student from auth service)
        file_id: 103,
        submitted_date: '2025-06-25T14:20:00Z',
        status: 'submitted'
      };
      return of(submittedSubmission);
    }
    
    // Default: no submission
    return of(null);
    // Real implementation: return this.get<AssignmentSubmission>(`/assignments/${assignmentId}/submissions/me`);
  }

  // POST /assignments - Create new assignment
  createAssignment(assignmentData: Partial<Assignment>): Observable<Assignment> {
    // Mock response for development
    const newAssignment: Assignment = {
      id: 'assign_' + Date.now(),
      title: assignmentData.title || '',
      description: assignmentData.description || '',
      due_date: assignmentData.due_date || '',
      max_score: assignmentData.max_score,
      course_id: assignmentData.course_id || '',
      created_by: assignmentData.created_by || '2', // Marie Martin (teacher from auth service)
      created_date: new Date().toISOString()
    };

    console.log('Creating assignment:', newAssignment);
    return of(newAssignment);
    // Real implementation: return this.post<Assignment>('/assignments', assignmentData);
  }

  // PUT /assignments/{assignmentId}/submissions/{submissionId}/grade - Grade a submission
  gradeSubmission(assignmentId: string, submissionId: string, score: number, feedback?: string): Observable<AssignmentSubmission> {
    // Mock response for development
    const updatedSubmission: AssignmentSubmission = {
      id: submissionId,
      assignment_id: assignmentId,
      student_id: '1', // Jean Dupont (student from auth service)
      file_id: 101, // Mock file ID
      submitted_date: '2025-02-10T14:30:00Z', // Mock submission date
      score: score,
      feedback: feedback,
      status: 'graded'
    };

    console.log('Grading submission:', submissionId, 'Score:', score, 'Feedback:', feedback);
    return of(updatedSubmission);
    // Real implementation: return this.put<AssignmentSubmission>(`/assignments/${assignmentId}/submissions/${submissionId}/grade`, { score, feedback });
  }
}
