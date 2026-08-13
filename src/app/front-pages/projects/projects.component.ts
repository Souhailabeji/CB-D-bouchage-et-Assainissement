import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-fp-projects',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent {

  // ==========================================
  // RÉGION ACTUELLEMENT OUVERTE
  // ==========================================

  selectedProject: number | null = null;


  // ==========================================
  // OUVRIR / FERMER LES SERVICES
  // ==========================================

  toggleServices(id: number): void {

    if (this.selectedProject === id) {

      // Fermer si la même région est déjà ouverte
      this.selectedProject = null;

    } else {

      // Ouvrir la nouvelle région
      this.selectedProject = id;

    }

  }


  // ==========================================
  // FERMER LA FENÊTRE
  // ==========================================

  closeServices(event: Event): void {

    event.stopPropagation();

    this.selectedProject = null;

  }


  // ==========================================
  // LES 12 RÉGIONS
  // ==========================================

  projects = [

    // ========================================
    // 01 - ÎLE-DE-FRANCE
    // ========================================

    {
      id: 1,

      image: '/images/fr1.png',

      title: 'Île-de-France',

      alt: 'Débouchage de canalisations en Île-de-France',

      href: '/blank-page',

      description:
        'Nous intervenons dans toute l’Île-de-France pour résoudre rapidement les problèmes de canalisations bouchées, WC engorgés, éviers, douches et réseaux d’évacuation. Nos techniciens utilisent des équipements professionnels afin d’identifier précisément l’origine du bouchon et de proposer une solution adaptée à chaque situation.',

      services: [

        {
          icon: 'plumbing',
          title: 'Débouchage de canalisations'
        },

        {
          icon: 'wc',
          title: 'Débouchage de WC'
        },

        {
          icon: 'camera',
          title: 'Inspection caméra'
        },

        {
          icon: 'water',
          title: 'Hydrocurage haute pression'
        },

        {
          icon: 'emergency',
          title: 'Débouchage d’urgence'
        },

        {
          icon: 'build',
          title: 'Réhabilitation de canalisation'
        }

      ]
    },


    // ========================================
    // 02 - HAUTS-DE-FRANCE
    // ========================================

    {
      id: 2,

      image: '/images/fr2.png',

      title: 'Hauts-de-France',

      alt: 'Débouchage de canalisations en Hauts-de-France',

      href: '/project-details/hauts-de-france',

      description:
        'Nos équipes interviennent dans les Hauts-de-France pour traiter les problèmes de canalisations bouchées, de WC engorgés et de réseaux d’évacuation. Chaque intervention est réalisée avec des équipements adaptés afin de garantir une solution efficace.',

      services: [

        {
          icon: 'plumbing',
          title: 'Débouchage de canalisations'
        },

        {
          icon: 'wc',
          title: 'Débouchage de WC'
        },

        {
          icon: 'camera',
          title: 'Inspection caméra'
        },

        {
          icon: 'water',
          title: 'Hydrocurage'
        },

        {
          icon: 'emergency',
          title: 'Intervention d’urgence'
        },

        {
          icon: 'build',
          title: 'Entretien des réseaux'
        }

      ]
    },


    // ========================================
    // 03 - NORMANDIE
    // ========================================

    {
      id: 3,

      image: '/images/fr3.png',

      title: 'Normandie',

      alt: 'Débouchage de canalisations en Normandie',

      href: '/project-details/normandie',

      description:
        'En Normandie, nos techniciens interviennent auprès des particuliers et des professionnels pour résoudre les problèmes de canalisations, WC, éviers, douches et réseaux d’assainissement.',

      services: [

        {
          icon: 'plumbing',
          title: 'Débouchage canalisation'
        },

        {
          icon: 'wc',
          title: 'Débouchage WC'
        },

        {
          icon: 'camera',
          title: 'Inspection caméra'
        },

        {
          icon: 'water',
          title: 'Hydrocurage'
        },

        {
          icon: 'emergency',
          title: 'Urgence débouchage'
        },

        {
          icon: 'build',
          title: 'Canalisation enterrée'
        }

      ]
    },


    // ========================================
    // 04 - BRETAGNE
    // ========================================

    {
      id: 4,

      image: '/images/fr4.png',

      title: 'Bretagne',

      alt: 'Débouchage de canalisations en Bretagne',

      href: '/project-details/bretagne',

      description:
        'Nos équipes interviennent dans toute la Bretagne pour les opérations de débouchage, d’inspection et d’entretien des canalisations des logements, commerces et locaux professionnels.',

      services: [

        {
          icon: 'plumbing',
          title: 'Débouchage canalisation'
        },

        {
          icon: 'wc',
          title: 'Débouchage WC'
        },

        {
          icon: 'camera',
          title: 'Inspection vidéo'
        },

        {
          icon: 'water',
          title: 'Hydrocurage'
        },

        {
          icon: 'emergency',
          title: 'Débouchage d’urgence'
        },

        {
          icon: 'build',
          title: 'Entretien réseau'
        }

      ]
    },


    // ========================================
    // 05 - PAYS DE LA LOIRE
    // ========================================

    {
      id: 5,

      image: '/images/fr5.png',

      title: 'Pays de la Loire',

      alt: 'Débouchage de canalisations dans les Pays de la Loire',

      href: '/project-details/pays-de-la-loire',

      description:
        'Nous intervenons dans les Pays de la Loire pour les problèmes de canalisations bouchées, WC engorgés et réseaux d’assainissement avec des solutions adaptées à chaque installation.',

      services: [

        {
          icon: 'plumbing',
          title: 'Débouchage canalisation'
        },

        {
          icon: 'wc',
          title: 'Débouchage WC'
        },

        {
          icon: 'camera',
          title: 'Inspection caméra'
        },

        {
          icon: 'water',
          title: 'Hydrocurage'
        },

        {
          icon: 'emergency',
          title: 'Intervention urgente'
        },

        {
          icon: 'build',
          title: 'Nettoyage canalisation'
        }

      ]
    },


    // ========================================
    // 06 - CENTRE-VAL DE LOIRE
    // ========================================

    {
      id: 6,

      image: '/images/fr6.png',

      title: 'Centre-Val de Loire',

      alt: 'Débouchage de canalisations en Centre-Val de Loire',

      href: '/project-details/centre-val-de-loire',

      description:
        'Nos spécialistes assurent le débouchage, le diagnostic et l’entretien des canalisations dans toute la région Centre-Val de Loire pour les particuliers et les professionnels.',

      services: [

        {
          icon: 'plumbing',
          title: 'Débouchage canalisation'
        },

        {
          icon: 'wc',
          title: 'Débouchage WC'
        },

        {
          icon: 'camera',
          title: 'Inspection caméra'
        },

        {
          icon: 'water',
          title: 'Hydrocurage'
        },

        {
          icon: 'emergency',
          title: 'Intervention urgente'
        },

        {
          icon: 'build',
          title: 'Réhabilitation'
        }

      ]
    },


    // ========================================
    // 07 - GRAND EST
    // ========================================

    {
      id: 7,

      image: '/images/fr7.png',

      title: 'Grand Est',

      alt: 'Débouchage de canalisations dans le Grand Est',

      href: '/project-details/grand-est',

      description:
        'Nos techniciens interviennent dans le Grand Est pour résoudre les problèmes d’engorgement et maintenir vos réseaux de canalisations en bon état.',

      services: [

        {
          icon: 'plumbing',
          title: 'Débouchage canalisation'
        },

        {
          icon: 'wc',
          title: 'Débouchage WC'
        },

        {
          icon: 'camera',
          title: 'Inspection caméra'
        },

        {
          icon: 'water',
          title: 'Hydrocurage'
        },

        {
          icon: 'emergency',
          title: 'Débouchage urgent'
        },

        {
          icon: 'build',
          title: 'Entretien réseau'
        }

      ]
    },


    // ========================================
    // 08 - BOURGOGNE-FRANCHE-COMTÉ
    // ========================================

    {
      id: 8,

      image: '/images/fr8.png',

      title: 'Bourgogne-Franche-Comté',

      alt: 'Débouchage de canalisations en Bourgogne-Franche-Comté',

      href: '/project-details/bourgogne-franche-comte',

      description:
        'Nous intervenons en Bourgogne-Franche-Comté pour le débouchage, l’inspection et l’entretien des réseaux de canalisations des particuliers et des professionnels.',

      services: [

        {
          icon: 'plumbing',
          title: 'Débouchage canalisation'
        },

        {
          icon: 'wc',
          title: 'Débouchage WC'
        },

        {
          icon: 'camera',
          title: 'Inspection caméra'
        },

        {
          icon: 'water',
          title: 'Hydrocurage'
        },

        {
          icon: 'emergency',
          title: 'Intervention urgente'
        },

        {
          icon: 'build',
          title: 'Réhabilitation'
        }

      ]
    },


    // ========================================
    // 09 - AUVERGNE-RHÔNE-ALPES
    // ========================================

    {
      id: 9,

      image: '/images/fr9.png',

      title: 'Auvergne-Rhône-Alpes',

      alt: 'Débouchage de canalisations en Auvergne-Rhône-Alpes',

      href: '/project-details/auvergne-rhone-alpes',

      description:
        'Nos experts interviennent en Auvergne-Rhône-Alpes pour les problèmes de canalisations bouchées et les besoins d’entretien des réseaux d’assainissement.',

      services: [

        {
          icon: 'plumbing',
          title: 'Débouchage canalisation'
        },

        {
          icon: 'wc',
          title: 'Débouchage WC'
        },

        {
          icon: 'camera',
          title: 'Inspection caméra'
        },

        {
          icon: 'water',
          title: 'Hydrocurage'
        },

        {
          icon: 'emergency',
          title: 'Débouchage urgent'
        },

        {
          icon: 'build',
          title: 'Réhabilitation'
        }

      ]
    },


    // ========================================
    // 10 - NOUVELLE-AQUITAINE
    // ========================================

    {
      id: 10,

      image: '/images/fr10.png',

      title: 'Nouvelle-Aquitaine',

      alt: 'Débouchage de canalisations en Nouvelle-Aquitaine',

      href: '/project-details/nouvelle-aquitaine',

      description:
        'Nous proposons des solutions professionnelles pour les canalisations bouchées et les réseaux d’assainissement en Nouvelle-Aquitaine, pour les particuliers comme pour les professionnels.',

      services: [

        {
          icon: 'plumbing',
          title: 'Débouchage canalisation'
        },

        {
          icon: 'wc',
          title: 'Débouchage WC'
        },

        {
          icon: 'camera',
          title: 'Inspection caméra'
        },

        {
          icon: 'water',
          title: 'Hydrocurage'
        },

        {
          icon: 'emergency',
          title: 'Intervention urgente'
        },

        {
          icon: 'build',
          title: 'Entretien réseau'
        }

      ]
    },


    // ========================================
    // 11 - OCCITANIE
    // ========================================

    {
      id: 11,

      image: '/images/fr11.png',

      title: 'Occitanie',

      alt: 'Débouchage de canalisations en Occitanie',

      href: '/project-details/occitanie',

      description:
        'En Occitanie, nos équipes interviennent pour le débouchage, l’inspection et l’entretien des réseaux d’évacuation des particuliers et des professionnels.',

      services: [

        {
          icon: 'plumbing',
          title: 'Débouchage canalisation'
        },

        {
          icon: 'wc',
          title: 'Débouchage WC'
        },

        {
          icon: 'camera',
          title: 'Inspection caméra'
        },

        {
          icon: 'water',
          title: 'Hydrocurage'
        },

        {
          icon: 'emergency',
          title: 'Débouchage d’urgence'
        },

        {
          icon: 'build',
          title: 'Entretien des réseaux'
        }

      ]
    },


    // ========================================
    // 12 - PROVENCE-ALPES-CÔTE D'AZUR
    // ========================================

    {
      id: 12,

      image: '/images/fr12.png',

      title: 'Provence-Alpes-Côte d’Azur',

      alt: 'Débouchage de canalisations en Provence-Alpes-Côte d’Azur',

      href: '/project-details/provence-alpes-cote-d-azur',

      description:
        'Nos professionnels interviennent en Provence-Alpes-Côte d’Azur pour résoudre les problèmes de canalisations et d’assainissement avec des techniques adaptées à chaque situation.',

      services: [

        {
          icon: 'plumbing',
          title: 'Débouchage canalisation'
        },

        {
          icon: 'wc',
          title: 'Débouchage WC'
        },

        {
          icon: 'camera',
          title: 'Inspection caméra'
        },

        {
          icon: 'water',
          title: 'Hydrocurage'
        },

        {
          icon: 'emergency',
          title: 'Débouchage urgent'
        },

        {
          icon: 'build',
          title: 'Réhabilitation'
        }

      ]
    }

  ];

}